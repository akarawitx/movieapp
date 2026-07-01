import { useEffect } from 'react'

export default function Toast({ toast, onHide }) {
  useEffect(() => {
    if (!toast.show) return
    const t = setTimeout(onHide, 3000)
    return () => clearTimeout(t)
  }, [toast.show])

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px', padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: '12px',
      maxWidth: '320px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      transform: toast.show ? 'translateX(0)' : 'translateX(120%)',
      transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      pointerEvents: toast.show ? 'auto' : 'none',
    }}>
      <span style={{ fontSize: '20px' }}>{toast.icon}</span>
      <span style={{ fontSize: '14px', color: '#fff', fontFamily: "'Prompt', sans-serif" }}>{toast.msg}</span>
    </div>
  )
}