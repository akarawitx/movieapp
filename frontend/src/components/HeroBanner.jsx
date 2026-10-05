import styles from "../css/components/HeroBanner.module.css";

export default function HeroBanner({ movie, onOpen, onWatchlist }) {
  if (!movie) return null;
  return (
    <div className={styles.hero}>
      {/* BG */}
      <div className={styles.bg}>
        <img src={movie.backdrop} alt="" className={styles.bgImg} />
        <div className={styles.bgShade} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.badge}>แนะนำประจำสัปดาห์</div>

        <h1 className={styles.title}>{movie.title}</h1>

        <div className={styles.metaRow}>
          <div className={styles.score}>
            <span className={styles.scoreNum}>★ {movie.score}</span>
            <span className={styles.scoreMax}>/ 10</span>
          </div>
          {[movie.year, movie.duration, movie.genreLabel].map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>

        <p className={styles.synopsis}>{movie.synopsis}</p>

        <div className={styles.buttons}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => onOpen(movie)}
          >
            ▶ ดูรีวิว
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => onWatchlist(movie)}
          >
            + เพิ่มในรายการ
          </button>
        </div>
      </div>
    </div>
  );
}