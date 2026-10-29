import { createContext, useContext, useEffect, useState } from 'react'
import { createAccount, hashPassword, seedAccounts } from '../data/accounts'
import { load, save } from '../utils/storage'

const AccountsContext = createContext(null)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_LOG = 200

// รหัสผ่านชั่วคราวสำหรับปุ่ม "รีเซ็ตรหัสผ่าน" ของผู้ดูแล
function tempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  const pick = () => chars[Math.floor(Math.random() * chars.length)]
  return `Pf-${Array.from({ length: 8 }, pick).join('')}`
}

function initialAccounts() {
  const accounts = load('accounts', null) ?? seedAccounts()
  // ผู้ใช้ที่ล็อกอินค้างไว้ตั้งแต่ก่อนมีทะเบียนบัญชี → เพิ่มให้ (ล็อกอินครั้งถัดไปจะตั้งรหัสผ่านที่กรอก)
  const current = load('user', null)
  if (current && !accounts[current]) accounts[current] = createAccount({ username: current })
  return accounts
}

// ทะเบียนบัญชี + สิทธิ์ผู้ดูแล + บันทึกการกระทำของผู้ดูแล (เก็บใน localStorage)
export function AccountsProvider({ user, onUserChange, children }) {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [auditLog, setAuditLog] = useState(() => load('audit', []))

  useEffect(() => {
    save('accounts', accounts)
  }, [accounts])

  useEffect(() => {
    save('audit', auditLog)
  }, [auditLog])

  const account = user ? accounts[user] ?? null : null
  const isAdmin = account?.role === 'admin' && account.status === 'active'

  // บัญชีถูกระงับระหว่างใช้งาน → ออกจากระบบ
  const suspended = account?.status === 'suspended'
  useEffect(() => {
    if (suspended) onUserChange(null)
  }, [suspended, onUserChange])

  const patchAccount = (username, patch) =>
    setAccounts((prev) =>
      prev[username] ? { ...prev, [username]: { ...prev[username], ...patch } } : prev
    )

  // ── เข้าสู่ระบบ / สมัครสมาชิก ──
  const login = (rawUsername, password) => {
    const username = rawUsername.trim()
    if (!username || !password) return { error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' }
    const hash = hashPassword(password)
    const now = new Date().toISOString()
    const existing = accounts[username]

    if (!existing) {
      // โหมดสาธิต: ชื่อผู้ใช้ที่ยังไม่มีบัญชีจะถูกสร้างให้อัตโนมัติ
      const created = createAccount({ username, passwordHash: hash, lastLoginAt: now })
      setAccounts((prev) => ({ ...prev, [username]: created }))
      onUserChange(username)
      return { account: created }
    }
    if (existing.status === 'suspended') {
      return { error: 'บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ' }
    }
    if (!existing.passwordHash && existing.community) {
      return { error: 'บัญชีนี้ยังไม่ได้ตั้งรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบ' }
    }
    if (existing.passwordHash && existing.passwordHash !== hash) {
      return { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }
    }
    patchAccount(username, { lastLoginAt: now, passwordHash: hash })
    onUserChange(username)
    return { account: existing }
  }

  const register = ({ username: rawUsername, email, password }) => {
    const username = rawUsername.trim()
    if (!username || !email || !password) return { error: 'กรุณากรอกข้อมูลให้ครบ' }
    if (!/^[A-Za-z0-9_.]{3,20}$/.test(username)) {
      return { error: 'ชื่อผู้ใช้ใช้ได้เฉพาะ a-z, 0-9, _ และ . ยาว 3–20 ตัว' }
    }
    if (accounts[username]) return { error: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' }
    if (!EMAIL_RE.test(email.trim())) return { error: 'กรุณากรอกอีเมลให้ถูกต้อง' }
    if (password.length < 6) return { error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }
    const created = createAccount({
      username,
      email: email.trim(),
      passwordHash: hashPassword(password),
      lastLoginAt: new Date().toISOString(),
    })
    setAccounts((prev) => ({ ...prev, [username]: created }))
    onUserChange(username)
    return { account: created }
  }

  const changePassword = (current, next) => {
    if (!account) return { error: 'กรุณาเข้าสู่ระบบ' }
    if (account.passwordHash && account.passwordHash !== hashPassword(current)) {
      return { error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' }
    }
    patchAccount(user, { passwordHash: hashPassword(next) })
    return {}
  }

  // ── ใช้ร่วมกับ ProfileContext (เปลี่ยน username / ลบบัญชีตัวเอง / แก้อีเมล) ──
  const renameAccount = (from, to) =>
    setAccounts((prev) => {
      if (!prev[from] || from === to) return prev
      const copy = { ...prev }
      copy[to] = { ...prev[from], username: to }
      delete copy[from]
      return copy
    })

  const removeAccount = (username) =>
    setAccounts((prev) => {
      const copy = { ...prev }
      delete copy[username]
      return copy
    })

  const updateAccount = (username, patch) => patchAccount(username, patch)

  // ── สำหรับผู้ดูแล (ตรวจเงื่อนไขกันพลาดก่อนทุกครั้ง) ──
  const activeAdmins = Object.values(accounts).filter(
    (a) => a.role === 'admin' && a.status === 'active'
  )
  // เป้าหมายเป็นผู้ดูแลที่ใช้งานได้คนสุดท้าย (ผู้ดูแลที่ถูกระงับอยู่แล้วไม่นับ)
  const isLastActiveAdmin = (target) =>
    target.role === 'admin' && target.status === 'active' && activeAdmins.length <= 1

  const logAction = (action, target, detail = '') =>
    setAuditLog((prev) =>
      [
        { id: `${Date.now()}-${prev.length}`, at: new Date().toISOString(), by: user, action, target, detail },
        ...prev,
      ].slice(0, MAX_LOG)
    )

  const setRole = (username, role) => {
    const target = accounts[username]
    if (!target) return { error: 'ไม่พบบัญชีนี้' }
    if (username === user) return { error: 'ไม่สามารถเปลี่ยนสิทธิ์ของบัญชีตัวเองได้' }
    if (role !== 'admin' && isLastActiveAdmin(target)) {
      return { error: 'ต้องมีผู้ดูแลระบบอย่างน้อย 1 คน' }
    }
    patchAccount(username, { role })
    return {}
  }

  const setStatus = (username, status) => {
    const target = accounts[username]
    if (!target) return { error: 'ไม่พบบัญชีนี้' }
    if (username === user) return { error: 'ไม่สามารถระงับบัญชีตัวเองได้' }
    if (status === 'suspended' && isLastActiveAdmin(target)) {
      return { error: 'ต้องมีผู้ดูแลระบบที่ใช้งานได้อย่างน้อย 1 คน' }
    }
    patchAccount(username, { status })
    return {}
  }

  const resetPassword = (username) => {
    if (!accounts[username]) return { error: 'ไม่พบบัญชีนี้' }
    const password = tempPassword()
    patchAccount(username, { passwordHash: hashPassword(password) })
    return { password }
  }

  const deleteAccountAsAdmin = (username) => {
    const target = accounts[username]
    if (!target) return { error: 'ไม่พบบัญชีนี้' }
    if (username === user) return { error: 'ไม่สามารถลบบัญชีตัวเองจากหน้านี้ได้' }
    if (isLastActiveAdmin(target)) {
      return { error: 'ต้องมีผู้ดูแลระบบอย่างน้อย 1 คน' }
    }
    removeAccount(username)
    return {}
  }

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        account,
        isAdmin,
        login,
        register,
        changePassword,
        renameAccount,
        removeAccount,
        updateAccount,
        auditLog,
        logAction,
        setRole,
        setStatus,
        resetPassword,
        deleteAccountAsAdmin,
      }}
    >
      {children}
    </AccountsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAccounts = () => useContext(AccountsContext)
