import { Link } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { getMovieReviews } from '../data/movieDetails'
import useLoginPrompt from '../hooks/useLoginPrompt'
import styles from '../css/components/MovieDetailModal.module.css'

// ดูแบบย่อ (quick view) — รายละเอียดเต็มและการเขียนรีวิวอยู่ที่หน้า /movies/:id
export default function MovieDetailModal({ movie, user, onClose, onToast }) {
  const { isInWatchlist, toggleWatchlist } = useProfile()
  const promptLogin = useLoginPrompt()

  if (!movie) return null

  const inWatchlist = user && isInWatchlist(movie.id)
  const preview = [...getMovieReviews(movie)].sort((a, b) => b.likes - a.likes).slice(0, 2)
  const detailUrl = `/movies/${movie.id}`

  const handleWatchlist = () => {
    if (!user) {
      onClose()
      promptLogin('เข้าสู่ระบบเพื่อเพิ่มหนังในรายการอยากดู')
      return
    }
    const added = toggleWatchlist(movie.id)
    onToast(added ? `เพิ่ม "${movie.title}" ในรายการแล้ว` : `นำ "${movie.title}" ออกจากรายการแล้ว`)
  }

  return (
    <div
      className={styles.overlay}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        {/* Close */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="ปิด">✕</button>

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
                <span className={styles.scoreNum}>{movie.score.toFixed(1)}</span>
                <span className={styles.scoreMeta}>
                  /10 · {movie.reviews.toLocaleString()} รีวิว
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
            <Link
              to={detailUrl}
              className={`${styles.actionBtn} ${styles.actionPrimary}`}
              onClick={onClose}
            >
              ดูรายละเอียดทั้งหมด
            </Link>
            <button
              className={`${styles.actionBtn} ${inWatchlist ? styles.actionActive : ''}`}
              onClick={handleWatchlist}
            >
              {inWatchlist ? '✓ อยู่ในรายการแล้ว' : '+ เพิ่มในรายการ'}
            </button>
          </div>

          {/* Review preview */}
          <div className={styles.reviewSection}>
            <div className={styles.sectionTitle}>รีวิวยอดนิยม</div>

            {preview.map(r => (
              <div key={r.id} className={styles.review}>
                <div className={styles.reviewHead}>
                  <div className={styles.reviewUser}>
                    {/* สีพื้นหลังมาจากข้อมูล จึงเก็บเป็น inline style ไว้ */}
                    <div className={styles.reviewAvatar} style={{ background: r.color }}>
                      {r.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className={styles.reviewName}>{r.name}</div>
                      <div className={styles.reviewDate}>
                        {new Date(r.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className={styles.reviewScore}>★ {r.score}/10</div>
                </div>
                <p className={styles.reviewText}>
                  {r.spoiler ? 'รีวิวนี้มีสปอยล์ — อ่านได้ในหน้ารายละเอียด' : r.body}
                </p>
              </div>
            ))}

            <Link to={`${detailUrl}#reviews`} className={styles.moreLink} onClick={onClose}>
              อ่านรีวิวทั้งหมด หรือเขียนรีวิวของคุณ →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
