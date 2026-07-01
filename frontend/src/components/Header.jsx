import { useState } from 'react'

const LogoSVG = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="3" width="20" height="14" rx="2" fill="#F5C518" opacity="0.95"/>
    <path d="M9 8l6 4-6 4V8z" fill="#0A0A0A"/>
    <rect x="7" y="19" width="10" height="2" rx="1" fill="#F5C518" opacity="0.4"/>
    <rect x="11" y="17" width="2" height="2" fill="#F5C518" opacity="0.6"/>
  </svg>
)

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.80)',
      backdropFilter: 'blur(6px)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div style={{
        background: '#1A1A1A', borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        width: '100%', maxWidth: '420px', padding: '36px 32px',
        position: 'relative', animation: 'modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        <button onClick={onClose} style={{
          position: 'absolute', top: '14px', right: '14px',
          background: 'rgba(255,255,255,0.06)', border: 'none',
          color: '#888', width: '32px', height: '32px',
          borderRadius: '50%', cursor: 'pointer', fontSize: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>
        {children}
      </div>
    </div>
  )
}

function Field({ label, type = 'text', placeholder, value, onChange }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '5px', fontWeight: 500 }}>
        {label}
      </label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={{
        width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px', padding: '10px 14px', color: '#fff',
        fontFamily: "'Prompt', sans-serif", fontSize: '14px', outline: 'none',
        boxSizing: 'border-box',
      }}
        onFocus={e => e.target.style.borderColor = 'rgba(245,197,24,0.45)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
      />
    </div>
  )
}

export default function Header({ onSearch, user, onLogin }) {
  const [loginOpen, setLoginOpen]       = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [profileOpen, setProfileOpen]   = useState(false)
  const [loginForm, setLoginForm]       = useState({ username: '', password: '' })
  const [regForm, setRegForm]           = useState({ username: '', email: '', password: '' })
  const [searchVal, setSearchVal]       = useState('')
  const [currentUser, setCurrentUser]   = useState(user || null)

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const handleLogin = () => {
    if (!loginForm.username || !loginForm.password) return
    setCurrentUser(loginForm.username)
    onLogin?.(loginForm.username)
    setLoginOpen(false)
    setLoginForm({ username: '', password: '' })
  }

  const handleRegister = () => {
    if (!regForm.username || !regForm.email || !regForm.password) return
    setCurrentUser(regForm.username)
    onLogin?.(regForm.username)
    setRegisterOpen(false)
    setRegForm({ username: '', email: '', password: '' })
  }

  const handleLogout = () => { setCurrentUser(null); onLogin?.(null); setProfileOpen(false) }

  const initials = currentUser?.substring(0, 2).toUpperCase() || 'U'

  const modalLogo = (sub) => (
    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
        <LogoSVG />
        <span style={{
          fontFamily: "'Prompt', sans-serif", fontSize: '20px', fontWeight: 700,
          background: 'linear-gradient(135deg, #F5C518, #FF6B35)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>CinePlex</span>
      </div>
      <p style={{ color: '#777', fontSize: '13px', margin: 0, fontFamily: "'Prompt', sans-serif" }}>{sub}</p>
    </div>
  )

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        background: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        height: '60px', display: 'flex', alignItems: 'center',
        padding: '0 4%', gap: '0',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', flexShrink: 0, marginRight: '28px' }}>
          <LogoSVG />
          <span style={{
            fontFamily: "'Prompt', sans-serif", fontSize: '18px', fontWeight: 700,
            background: 'linear-gradient(135deg, #F5C518, #FF6B35)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.3px',
          }}>CinePlex</span>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '2px', marginRight: '20px' }}>
          {[{ label: 'กำลังฮิต', id: 'trending' }, { label: 'ยอดนิยม', id: 'toprated' }, { label: 'เร็วๆ นี้', id: 'upcoming' }].map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)} style={{
              color: '#999', background: 'none', border: 'none', fontSize: '13px',
              padding: '5px 11px', borderRadius: '6px', cursor: 'pointer',
              fontFamily: "'Prompt', sans-serif", whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#999'; e.currentTarget.style.background = 'none' }}
            >{item.label}</button>
          ))}
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: '260px', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: '12px', color: '#555', pointerEvents: 'none', display: 'flex' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input type="text" placeholder="ค้นหาหนัง..." value={searchVal}
            onChange={e => { setSearchVal(e.target.value); onSearch?.(e.target.value) }}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px', padding: '6px 14px 6px 34px',
              color: '#fff', fontFamily: "'Prompt', sans-serif", fontSize: '13px', outline: 'none',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(245,197,24,0.35)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
          />
        </div>

        {/* Auth */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: 'auto' }}>
          {!currentUser ? (
            <>
              <button onClick={() => setLoginOpen(true)} style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
                color: '#ccc', fontSize: '13px', padding: '6px 16px', borderRadius: '7px',
                cursor: 'pointer', fontFamily: "'Prompt', sans-serif",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#F5C518'; e.currentTarget.style.color = '#F5C518' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#ccc' }}
              >เข้าสู่ระบบ</button>
              <button onClick={() => setRegisterOpen(true)} style={{
                background: '#F5C518', color: '#000', border: 'none',
                fontSize: '13px', fontWeight: 700, padding: '6px 16px', borderRadius: '7px',
                cursor: 'pointer', fontFamily: "'Prompt', sans-serif",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#D4A017' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F5C518' }}
              >สมัครสมาชิก</button>
            </>
          ) : (
            <button onClick={() => setProfileOpen(true)} style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #F5C518, #FF6B35)',
              border: '2px solid transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '12px', color: '#000',
              fontFamily: "'Prompt', sans-serif",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#F5C518'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
            >{initials}</button>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      <Modal isOpen={loginOpen} onClose={() => setLoginOpen(false)}>
        {modalLogo('เข้าสู่ระบบเพื่อรีวิวหนังและบันทึกรายการโปรด')}
        <Field label="ชื่อผู้ใช้" placeholder="กรอกชื่อผู้ใช้"
          value={loginForm.username} onChange={e => setLoginForm({ ...loginForm, username: e.target.value })} />
        <Field label="รหัสผ่าน" type="password" placeholder="กรอกรหัสผ่าน"
          value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
        <button onClick={handleLogin} style={{
          width: '100%', background: '#F5C518', color: '#000', border: 'none',
          padding: '12px', borderRadius: '8px', fontSize: '15px', fontWeight: 700,
          cursor: 'pointer', fontFamily: "'Prompt', sans-serif", marginTop: '6px',
        }}>เข้าสู่ระบบ</button>
        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: '#666', fontFamily: "'Prompt', sans-serif" }}>
          ยังไม่มีบัญชี?{' '}
          <span onClick={() => { setLoginOpen(false); setRegisterOpen(true) }}
            style={{ color: '#F5C518', cursor: 'pointer', fontWeight: 600 }}>สมัครสมาชิกฟรี</span>
        </p>
      </Modal>

      {/* Register Modal */}
      <Modal isOpen={registerOpen} onClose={() => setRegisterOpen(false)}>
        {modalLogo('สร้างบัญชีเพื่อเริ่มรีวิวหนัง')}
        <Field label="ชื่อผู้ใช้" placeholder="กรอกชื่อผู้ใช้"
          value={regForm.username} onChange={e => setRegForm({ ...regForm, username: e.target.value })} />
        <Field label="อีเมล" type="email" placeholder="your@email.com"
          value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })} />
        <Field label="รหัสผ่าน" type="password" placeholder="อย่างน้อย 6 ตัวอักษร"
          value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })} />
        <button onClick={handleRegister} style={{
          width: '100%', background: '#F5C518', color: '#000', border: 'none',
          padding: '12px', borderRadius: '8px', fontSize: '15px', fontWeight: 700,
          cursor: 'pointer', fontFamily: "'Prompt', sans-serif", marginTop: '6px',
        }}>สมัครสมาชิกฟรี</button>
        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: '#666', fontFamily: "'Prompt', sans-serif" }}>
          มีบัญชีแล้ว?{' '}
          <span onClick={() => { setRegisterOpen(false); setLoginOpen(true) }}
            style={{ color: '#F5C518', cursor: 'pointer', fontWeight: 600 }}>เข้าสู่ระบบ</span>
        </p>
      </Modal>

      {/* Profile Modal */}
      <Modal isOpen={profileOpen} onClose={() => setProfileOpen(false)}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #F5C518, #FF6B35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Prompt', sans-serif", fontWeight: 700, fontSize: '22px', color: '#000',
            margin: '0 auto 10px',
          }}>{initials}</div>
          <div style={{ fontFamily: "'Prompt', sans-serif", fontSize: '16px', fontWeight: 600, color: '#fff' }}>{currentUser}</div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '3px', fontFamily: "'Prompt', sans-serif" }}>สมาชิก CinePlex</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '18px' }}>
          {[{ label: 'รีวิว', value: '0' }, { label: 'รายการ', value: '0' }, { label: 'Likes', value: '0' }].map(s => (
            <div key={s.label} style={{ background: '#111', borderRadius: '8px', padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Prompt', sans-serif", fontSize: '20px', fontWeight: 700, color: '#F5C518' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#666', fontFamily: "'Prompt', sans-serif" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', background: 'rgba(229,9,20,0.1)', color: '#FF6B6B',
          border: '1px solid rgba(229,9,20,0.18)', padding: '11px', borderRadius: '8px',
          fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Prompt', sans-serif",
        }}>ออกจากระบบ</button>
      </Modal>
    </>
  )
}