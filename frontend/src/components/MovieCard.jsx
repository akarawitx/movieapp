import styles from "../css/components/MovieCard.module.css";

export default function MovieCard({ movie, onOpen, onWatchlist }) {
  return (
    <div className={styles.card} onClick={() => onOpen(movie)}>
      {/* Poster */}
      <div className={styles.poster}>
        <img
          className={styles.posterImg}
          src={movie.poster}
          alt={movie.title}
          onError={(e) => {
            e.target.style.display = "none"; // ซ่อนรูปที่โหลดไม่ได้
          }}
        />
        <div className={styles.overlay} />

        {/* Score Badge */}
        <div className={styles.scoreBadge}>
          <span className={styles.scoreText}>★ {movie.score}</span>
        </div>

        {/* Quick Actions */}
        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${styles.plusBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              onWatchlist(movie);
            }}
          >
            +
          </button>
          <button
            className={styles.actionBtn}
            onClick={(e) => {
              e.stopPropagation();
              onOpen(movie);
            }}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.title}>{movie.title}</div>
        <div className={styles.meta}>
          <span className={styles.genre}>{movie.genreLabel}</span>
          <span className={styles.year}>{movie.year}</span>
        </div>
        <div className={styles.reviews}>
          {movie.reviews.toLocaleString()} รีวิว
        </div>
      </div>
    </div>
  );
}
