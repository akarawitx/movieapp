const STATS = [
  { number: '12,840', label: 'รีวิวทั้งหมด' },
  { number: '3,250', label: 'หนังในฐานข้อมูล' },
  { number: '48,600', label: 'สมาชิก' },
  { number: '8.4', label: 'คะแนนเฉลี่ย' },
]

export default function StatsBar() {
  return (
    <div style={{ padding: '0 5%', marginTop: '-20px', position: 'relative', zIndex: 10 }}>
      <div style={{
        background: 'linear-gradient(135deg, #1A1A1A, #222)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px', padding: '32px 40px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px', textAlign: 'center',
      }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{ position: 'relative' }}>
            {i < STATS.length - 1 && (
              <div style={{
                position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
                width: '1px', height: '50%', background: 'rgba(255,255,255,0.08)',
              }} />
            )}
            <div style={{
              fontFamily: "'Prompt', sans-serif", fontSize: '36px', fontWeight: 900,
              background: 'linear-gradient(135deg, #F5C518, #FF6B35)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              lineHeight: 1, marginBottom: '6px',
            }}>{s.number}</div>
            <div style={{ color: '#aaa', fontSize: '13px', fontFamily: "'Prompt', sans-serif" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}