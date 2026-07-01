const GENRES = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'action', label: 'แอ็คชั่น' },
  { id: 'scifi', label: 'Sci-Fi' },
  { id: 'drama', label: 'ดราม่า' },
  { id: 'horror', label: 'สยองขวัญ' },
  { id: 'comedy', label: 'ตลก' },
  { id: 'romance', label: 'โรแมนติก' },
]

export default function GenreTabs({ active, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: '8px', overflowX: 'auto',
      paddingBottom: '4px', marginBottom: '28px',
      scrollbarWidth: 'none',
    }}>
      {GENRES.map(g => (
        <button
          key={g.id}
          onClick={() => onChange(g.id)}
          style={{
            background: active === g.id ? '#F5C518' : '#1A1A1A',
            border: `1px solid ${active === g.id ? '#F5C518' : 'rgba(255,255,255,0.08)'}`,
            color: active === g.id ? '#000' : '#aaa',
            fontSize: '13px', fontWeight: 600,
            padding: '8px 20px', borderRadius: '24px', cursor: 'pointer',
            transition: 'all 0.2s', whiteSpace: 'nowrap',
            fontFamily: "'Prompt', sans-serif",
          }}
          onMouseEnter={e => {
            if (active !== g.id) {
              e.currentTarget.style.borderColor = '#F5C518'
              e.currentTarget.style.color = '#F5C518'
            }
          }}
          onMouseLeave={e => {
            if (active !== g.id) {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.color = '#aaa'
            }
          }}
        >{g.label}</button>
      ))}
    </div>
  )
}