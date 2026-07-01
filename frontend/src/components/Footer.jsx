const LogoSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="3" width="20" height="14" rx="2" fill="#F5C518" opacity="0.95"/>
    <path d="M9 8l6 4-6 4V8z" fill="#0A0A0A"/>
  </svg>
)

export default function Footer() {
  const cols = [
    { title: 'หมวดหมู่', links: ['แอ็คชั่น', 'ดราม่า', 'ตลก', 'สยองขวัญ', 'หนังไทย'] },
    { title: 'บริการ', links: ['รีวิวหนัง', 'Top Charts', 'ปฏิทินฉาย', 'รายการดู'] },
    { title: 'เกี่ยวกับ', links: ['เกี่ยวกับเรา', 'ติดต่อเรา', 'นโยบายความเป็นส่วนตัว', 'เงื่อนไขการใช้งาน'] },
  ]

  return (
    <footer style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '48px 5% 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <LogoSVG />
            <span style={{
              fontFamily: "'Prompt', sans-serif", fontSize: '20px', fontWeight: 700,
              background: 'linear-gradient(135deg, #F5C518, #FF6B35)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>CinePlex</span>
          </div>
          <p style={{ color: '#666', fontSize: '13px', lineHeight: 1.7, fontFamily: "'Prompt', sans-serif" }}>
            แพลตฟอร์มรีวิวหนังและซีรีส์ที่ใหญ่ที่สุดในไทย รีวิวโดยคนไทย สำหรับคนไทย ค้นพบหนังดีๆ อ่านรีวิวจริงจากผู้ชมทั่วประเทศ
          </p>
        </div>

        {/* Cols */}
        {cols.map(col => (
          <div key={col.title}>
            <div style={{ fontFamily: "'Prompt', sans-serif", fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>
              {col.title}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {col.links.map(link => (
                <li key={link} style={{ marginBottom: '10px' }}>
                  <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '13px', fontFamily: "'Prompt', sans-serif", transition: 'color 0.15s' }}
                    onMouseEnter={e => e.target.style.color = '#F5C518'}
                    onMouseLeave={e => e.target.style.color = '#666'}
                  >{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ color: '#444', fontSize: '12px', fontFamily: "'Prompt', sans-serif" }}>
          © 2024 CinePlex Thailand. สงวนลิขสิทธิ์ทุกประการ
        </span>
        <span style={{ color: '#444', fontSize: '12px', fontFamily: "'Prompt', sans-serif" }}>
          สร้างด้วยความรักสำหรับคนรักหนัง
        </span>
      </div>
    </footer>
  )
}