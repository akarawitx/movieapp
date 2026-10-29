// ทะเบียนบัญชีจำลอง (ยังไม่ต่อ API) — ระบบจริงต้องตรวจรหัสผ่านและสิทธิ์ผู้ดูแลที่ backend เสมอ
import { REVIEWERS } from './movieDetails'

// บัญชีผู้ดูแลสำหรับเดโม (เขียนไว้ใน README ด้วย)
export const DEMO_ADMIN = { username: 'admin', password: 'Admin@1234' }

export const ROLES = [
  { id: 'user', label: 'ผู้ใช้' },
  { id: 'admin', label: 'ผู้ดูแลระบบ' },
]

export const STATUSES = [
  { id: 'active', label: 'ใช้งานอยู่' },
  { id: 'suspended', label: 'ถูกระงับ' },
]

// hash แบบง่าย (cyrb53) เพื่อไม่ให้เก็บรหัสผ่านเป็นข้อความตรงๆ ใน localStorage
// ไม่ใช่การเข้ารหัสที่ปลอดภัย — ใช้แค่ในโหมดสาธิตเท่านั้น
export function hashPassword(password) {
  const str = `pixelfilm:${password}`
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16)
}

export const createAccount = ({ username, email, role = 'user', passwordHash = null, ...rest }) => ({
  username,
  email: email ?? `${username}@example.com`,
  role,
  status: 'active',
  passwordHash,
  createdAt: new Date().toISOString(),
  lastLoginAt: null,
  ...rest,
})

// บัญชีตั้งต้น: ผู้ดูแล 1 คน + นักรีวิวจำลอง (ยังไม่มีรหัสผ่าน ต้องให้ผู้ดูแลรีเซ็ตก่อนจึงจะเข้าสู่ระบบได้)
export function seedAccounts() {
  const admin = createAccount({
    username: DEMO_ADMIN.username,
    email: 'admin@pixelfilm.app',
    role: 'admin',
    passwordHash: hashPassword(DEMO_ADMIN.password),
    createdAt: '2023-01-01T00:00:00.000Z',
  })
  const reviewers = REVIEWERS.map((r) =>
    createAccount({
      username: r.username,
      email: `${r.username}@example.com`,
      createdAt: `${r.joinedAt}T09:00:00.000Z`,
      community: true,
    })
  )
  return Object.fromEntries([admin, ...reviewers].map((a) => [a.username, a]))
}

// โปรไฟล์/กิจกรรมตั้งต้นของบัญชีที่ไม่ควรได้ข้อมูลจำลองแบบผู้ใช้ทั่วไป
export const SEED_PROFILES = {
  admin: {
    firstName: 'ผู้ดูแล',
    lastName: 'ระบบ',
    bio: 'ดูแลแคตตาล็อกหนังและชุมชน PixelFilm',
    joinedAt: '2023-01-01',
    favoriteGenres: [],
  },
}

export const EMPTY_ACTIVITY = { reviews: [], watchlist: [], watched: [], ratings: [] }
export const SEED_ACTIVITIES = { admin: EMPTY_ACTIVITY }

export const roleLabel = (id) => ROLES.find((r) => r.id === id)?.label ?? id
export const statusLabel = (id) => STATUSES.find((s) => s.id === id)?.label ?? id
