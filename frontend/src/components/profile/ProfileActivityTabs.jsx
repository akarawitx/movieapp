import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MOVIES } from "../../data/movies";
import Icon from "../Icon";
import styles from "../../css/components/profile/ProfileActivityTabs.module.css";

const findMovie = (id) => MOVIES.find((m) => m.id === id);

function EmptyState({ text }) {
  const navigate = useNavigate();
  return (
    <div className={styles.empty}>
      <Icon name="film" size={36} />
      <p>{text}</p>
      <button className={styles.emptyBtn} onClick={() => navigate("/movies")}>
        ไปดูรายการหนัง
      </button>
    </div>
  );
}

function ReviewsTab({ reviews, readOnly }) {
  if (!reviews.length)
    return <EmptyState text={readOnly ? "ยังไม่มีรีวิว" : "คุณยังไม่ได้เขียนรีวิว"} />;
  return (
    <div className={styles.reviewList}>
      {reviews.map((r) => {
        const movie = findMovie(r.movieId);
        if (!movie) return null;
        return (
          <article key={r.id} className={styles.review}>
            <img className={styles.reviewPoster} src={movie.poster} alt={movie.title} />
            <div className={styles.reviewBody}>
              <div className={styles.reviewTop}>
                <h3 className={styles.reviewMovie}>
                  {movie.title} <span className={styles.year}>({movie.year})</span>
                </h3>
                <span className={styles.score}>★ {r.score}/10</span>
              </div>
              <h4 className={styles.reviewTitle}>{r.title}</h4>
              <p className={styles.reviewText}>{r.body}</p>
              <time className={styles.date}>
                {new Date(r.date).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </time>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function PosterGrid({ items, emptyText }) {
  if (!items.length) return <EmptyState text={emptyText} />;
  return (
    <div className={styles.posterGrid}>
      {items.map(({ movie, score }) => (
        <div key={movie.id} className={styles.posterCard}>
          <div className={styles.posterWrap}>
            <img src={movie.poster} alt={movie.title} />
            {score != null && <span className={styles.badge}>★ {score}</span>}
          </div>
          <div className={styles.posterTitle}>{movie.title}</div>
          <div className={styles.posterMeta}>
            {movie.year} · {movie.genreLabel}
          </div>
        </div>
      ))}
    </div>
  );
}

// readOnly = โปรไฟล์สาธารณะ, hideWatchlist = เจ้าของปิดการแสดงรายการอยากดู
export default function ProfileActivityTabs({ activity, readOnly = false, hideWatchlist = false }) {
  const [tab, setTab] = useState("reviews");

  const watchlist = activity.watchlist
    .map((id) => ({ movie: findMovie(id) }))
    .filter((x) => x.movie);
  const ratings = activity.ratings
    .map((r) => ({ movie: findMovie(r.movieId), score: r.score }))
    .filter((x) => x.movie);

  const tabs = [
    { id: "reviews", label: readOnly ? "รีวิว" : "รีวิวของฉัน", count: activity.reviews.length },
    ...(hideWatchlist ? [] : [{ id: "watchlist", label: "อยากดู", count: watchlist.length }]),
    { id: "ratings", label: "ให้คะแนนแล้ว", count: ratings.length },
  ];

  return (
    <section className={styles.wrap}>
      <div className={styles.tabs} role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            <span className={styles.count}>{t.count}</span>
          </button>
        ))}
      </div>

      <div className={styles.panel} role="tabpanel">
        {tab === "reviews" && <ReviewsTab reviews={activity.reviews} readOnly={readOnly} />}
        {tab === "watchlist" && (
          <>
            <PosterGrid items={watchlist} emptyText="ยังไม่มีหนังในรายการอยากดู" />
            {watchlist.length > 0 && !readOnly && (
              <Link to="/watchlist" className={styles.viewAll}>
                จัดการรายการอยากดู →
              </Link>
            )}
          </>
        )}
        {tab === "ratings" && (
          <PosterGrid
            items={ratings}
            emptyText={readOnly ? "ยังไม่ได้ให้คะแนนหนังเรื่องไหน" : "คุณยังไม่ได้ให้คะแนนหนังเรื่องไหน"}
          />
        )}
      </div>
    </section>
  );
}
