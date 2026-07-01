import { useState } from 'react'

export default function MovieDetailModal({ movie, user, onClose, onToast }) {
  const [rating, setRating]     = useState(0)
  const [hover, setHover]       = useState(0)
  const [reviewText, setReview] = useState('')
  const [reviews, setReviews]   = useState([])

  if (!movie) return null

  const submitReview = () => {
    if (!user) { onToast('กรุณาเข้าสู่ระบบก่อน'); return }
    if (!reviewText.trim()) { onToast('กรุณาเขียนรีวิวก่อน'); return }
    if (!rating) { onToast('กรุณาให้คะแนนก่อน'); return }
    const COLORS = ['#F5C518', '#00B4D8', '#2ECC71', '#E91E8B', '#FF6B35']
    setReviews([{
      id: Date.now(), name: user,
      initials: user.substring(0, 2).toUpperCase(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      score: rating, text: reviewText, likes: 0,
      date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
    }, ...reviews])
    setReview(''); setRating(0)
    onToast('เผยแพร่รีวิวสำเร็จ!')
  }

  const avgScore = reviews.length
    ? ((reviews.reduce((s, r) => s + r.score, 0) / reviews.length) + movie.score) / 2
    : movie.score

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
    >
      <div style={{
        background: '#1A1A1A', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)',
        width: '100%', maxWidth: '680px', maxHeight: '88vh', overflowY: 'auto',
        position: 'relative', animation: 'modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}`}</style>

        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', zIndex: 10,
          background: 'rgba(0,0,0,0.6)', border: 'none', color: '#aaa',
          width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>

        {/* Hero Image */}
        <div style={{ position: 'relative', height: '260px', borderRadius: '20px 20px 0 0', overflow: 'hidden' }}>
          <img src={movie.backdrop || movie.poster} alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.src = movie.poster }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #1A1A1A 0%, transparent 60%)' }} />
        </div>

        <div style={{ padding: '0 32px 32px' }}>
          {/* Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '20px', marginBottom: '20px', marginTop: '-60px', position: 'relative', zIndex: 2 }}>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '3px solid rgba(245,197,24,0.25)', flexShrink: 0 }}>
              <img src={movie.poster} alt={movie.title} style={{ width: '100%', display: 'block' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '4px' }}>
              <div style={{ fontFamily: "'Prompt', sans-serif", fontSize: '22px', fontWeight: 800, lineHeight: 1.2, marginBottom: '8px', color: '#fff' }}>
                {movie.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '10px' }}>
                <span style={{ fontFamily: "'Prompt', sans-serif", fontSize: '38px', fontWeight: 900, color: '#F5C518', lineHeight: 1 }}>
                  {avgScore.toFixed(1)}
                </span>
                <span style={{ color: '#666', fontSize: '13px', fontFamily: "'Prompt', sans-serif" }}>
                  /10 · {(movie.reviews + reviews.length).toLocaleString()} รีวิว
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[movie.year, movie.duration, movie.genreLabel].map(t => (
                  <span key={t} style={{
                    background: '#222', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#aaa', padding: '4px 12px', borderRadius: '6px',
                    fontSize: '12px', fontFamily: "'Prompt', sans-serif",
                  }}>{t}</span>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginTop: '8px', fontFamily: "'Prompt', sans-serif" }}>
                กำกับโดย {movie.director}
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <p style={{ color: '#aaa', lineHeight: 1.75, fontSize: '14px', marginBottom: '20px', fontFamily: "'Prompt', sans-serif" }}>
            {movie.synopsis}
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {[
              { label: '+ เพิ่มในรายการ', bg: '#E50914', color: '#fff' },
              { label: 'แชร์', bg: 'rgba(255,255,255,0.08)', color: '#fff' },
              { label: 'ชอบ', bg: 'rgba(255,255,255,0.08)', color: '#fff' },
            ].map(btn => (
              <button key={btn.label} style={{
                background: btn.bg, color: btn.color,
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '10px 20px', borderRadius: '10px', cursor: 'pointer',
                fontFamily: "'Prompt', sans-serif", fontSize: '14px', fontWeight: 600,
              }}>{btn.label}</button>
            ))}
          </div>

          {/* Review Section */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>
            <div style={{ fontFamily: "'Prompt', sans-serif", fontSize: '17px', fontWeight: 700, marginBottom: '20px', color: '#fff' }}>
              รีวิวจากผู้ชม
            </div>

            {/* Review Form */}
            <div style={{
              background: '#222', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px', padding: '20px', marginBottom: '20px',
            }}>
              <div style={{ fontFamily: "'Prompt', sans-serif", fontSize: '15px', fontWeight: 600, marginBottom: '14px', color: '#fff' }}>
                เขียนรีวิวของคุณ
              </div>

              {/* Star Picker */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', alignItems: 'center' }}>
                {[2, 4, 6, 8, 10].map(val => (
                  <span key={val}
                    onClick={() => setRating(val)}
                    onMouseEnter={() => setHover(val)}
                    onMouseLeave={() => setHover(0)}
                    style={{
                      fontSize: '28px', cursor: 'pointer', lineHeight: 1,
                      color: val <= (hover || rating) ? '#F5C518' : '#333',
                      transition: 'color 0.15s',
                    }}>★</span>
                ))}
                {rating > 0 && (
                  <span style={{ color: '#aaa', fontSize: '13px', marginLeft: '8px', fontFamily: "'Prompt', sans-serif" }}>
                    {rating}/10
                  </span>
                )}
              </div>

              <textarea
                placeholder="แบ่งปันความคิดเห็นของคุณ..."
                value={reviewText}
                onChange={e => setReview(e.target.value)}
                style={{
                  width: '100%', background: '#1A1A1A',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', padding: '12px 16px',
                  color: '#fff', fontFamily: "'Prompt', sans-serif", fontSize: '14px',
                  outline: 'none', resize: 'none', height: '100px',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(245,197,24,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />

              <button
                onClick={submitReview}
                style={{
                  marginTop: '12px', background: '#F5C518', color: '#000',
                  border: 'none', padding: '11px 24px', borderRadius: '8px',
                  fontFamily: "'Prompt', sans-serif", fontSize: '14px', fontWeight: 700,
                  cursor: 'pointer',
                }}
              >เผยแพร่รีวิว</button>
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p style={{ color: '#444', textAlign: 'center', padding: '20px 0', fontFamily: "'Prompt', sans-serif", fontSize: '14px' }}>
                ยังไม่มีรีวิว — เป็นคนแรกที่รีวิวหนังเรื่องนี้!
              </p>
            ) : reviews.map(r => (
              <div key={r.id} style={{
                background: '#222', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px', padding: '18px', marginBottom: '14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: r.color, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#000',
                      fontFamily: "'Prompt', sans-serif", flexShrink: 0,
                    }}>{r.initials}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff', fontFamily: "'Prompt', sans-serif" }}>{r.name}</div>
                      <div style={{ fontSize: '12px', color: '#555', fontFamily: "'Prompt', sans-serif" }}>{r.date}</div>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(245,197,24,0.15)', color: '#F5C518',
                    padding: '4px 10px', borderRadius: '8px',
                    fontWeight: 700, fontSize: '13px', fontFamily: "'Prompt', sans-serif",
                  }}>★ {r.score}/10</div>
                </div>
                <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.7, fontFamily: "'Prompt', sans-serif" }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}