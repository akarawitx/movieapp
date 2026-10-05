import { useState } from 'react'
import styles from '../css/components/MovieDetailModal.module.css'

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
      className={styles.overlay}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        {/* Close */}
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {/* Hero Image */}
        <div className={styles.cover}>
          <img
            className={styles.coverImg}
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            onError={e => { e.target.src = movie.poster }}
          />
          <div className={styles.coverShade} />
        </div>

        <div className={styles.body}>
          {/* Info Grid */}
          <div className={styles.infoGrid}>
            <div className={styles.posterBox}>
              <img className={styles.posterImg} src={movie.poster} alt={movie.title} />
            </div>
            <div className={styles.infoText}>
              <div className={styles.title}>{movie.title}</div>
              <div className={styles.scoreRow}>
                <span className={styles.scoreNum}>{avgScore.toFixed(1)}</span>
                <span className={styles.scoreMeta}>
                  /10 · {(movie.reviews + reviews.length).toLocaleString()} รีวิว
                </span>
              </div>
              <div className={styles.tags}>
                {[movie.year, movie.duration, movie.genreLabel].map(t => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
              <div className={styles.director}>กำกับโดย {movie.director}</div>
            </div>
          </div>

          {/* Synopsis */}
          <p className={styles.synopsis}>{movie.synopsis}</p>

          {/* Action Buttons */}
          <div className={styles.actions}>
            {[
              { label: '+ เพิ่มในรายการ', primary: true },
              { label: 'แชร์' },
              { label: 'ชอบ' },
            ].map(btn => (
              <button
                key={btn.label}
                className={`${styles.actionBtn} ${btn.primary ? styles.actionPrimary : ''}`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Review Section */}
          <div className={styles.reviewSection}>
            <div className={styles.sectionTitle}>รีวิวจากผู้ชม</div>

            {/* Review Form */}
            <div className={styles.form}>
              <div className={styles.formTitle}>เขียนรีวิวของคุณ</div>

              {/* Star Picker */}
              <div className={styles.starPicker}>
                {[2, 4, 6, 8, 10].map(val => (
                  <span
                    key={val}
                    className={`${styles.starBtn} ${val <= (hover || rating) ? styles.starOn : ''}`}
                    onClick={() => setRating(val)}
                    onMouseEnter={() => setHover(val)}
                    onMouseLeave={() => setHover(0)}
                  >★</span>
                ))}
                {rating > 0 && <span className={styles.ratingText}>{rating}/10</span>}
              </div>

              <textarea
                className={styles.textarea}
                placeholder="แบ่งปันความคิดเห็นของคุณ..."
                value={reviewText}
                onChange={e => setReview(e.target.value)}
              />

              <button className={styles.submitBtn} onClick={submitReview}>
                เผยแพร่รีวิว
              </button>
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className={styles.empty}>
                ยังไม่มีรีวิว — เป็นคนแรกที่รีวิวหนังเรื่องนี้!
              </p>
            ) : reviews.map(r => (
              <div key={r.id} className={styles.review}>
                <div className={styles.reviewHead}>
                  <div className={styles.reviewUser}>
                    {/* สีพื้นหลังสุ่มจาก JS จึงเก็บเป็น inline style ไว้ */}
                    <div className={styles.reviewAvatar} style={{ background: r.color }}>
                      {r.initials}
                    </div>
                    <div>
                      <div className={styles.reviewName}>{r.name}</div>
                      <div className={styles.reviewDate}>{r.date}</div>
                    </div>
                  </div>
                  <div className={styles.reviewScore}>★ {r.score}/10</div>
                </div>
                <p className={styles.reviewText}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}