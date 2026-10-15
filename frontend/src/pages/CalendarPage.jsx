import { useState } from "react";
import { Link } from "react-router-dom";
import { MOVIES } from "../data/movies";
import { MOVIE_DETAILS } from "../data/movieDetails";
import useWatchlistToggle from "../hooks/useWatchlistToggle";
import Poster from "../components/Poster";
import Icon from "../components/Icon";
import styles from "../css/pages/CalendarPage.module.css";

const DAY_MS = 24 * 60 * 60 * 1000;

// วันที่ในข้อมูลเป็น YYYY-MM-DD → อ่านเป็นเวลาท้องถิ่น (ไม่ให้เลื่อนวันเพราะ timezone)
const parseDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const ENTRIES = MOVIES.filter((m) => MOVIE_DETAILS[m.id]?.releaseDate)
  .map((movie) => ({
    movie,
    details: MOVIE_DETAILS[movie.id],
    date: parseDate(MOVIE_DETAILS[movie.id].releaseDate),
  }))
  .sort((a, b) => b.date - a.date);

const YEARS = [...new Set(ENTRIES.map((e) => e.date.getFullYear()))];

const monthKey = (d) => `${d.getFullYear()}-${d.getMonth()}`;
const monthLabel = (d) => d.toLocaleDateString("th-TH", { month: "long", year: "numeric" });

function daysUntil(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((date - today) / DAY_MS);
}

function ReleaseItem({ entry, watchlist }) {
  const { movie, details, date } = entry;
  const days = daysUntil(date);
  const released = days <= 0;
  const inList = watchlist.inList(movie);

  return (
    <article className={styles.item}>
      <div className={styles.date}>
        <span className={styles.day}>{date.getDate()}</span>
        <span className={styles.weekday}>
          {date.toLocaleDateString("th-TH", { weekday: "short" })}
        </span>
      </div>

      <Link to={`/movies/${movie.id}`} className={styles.poster}>
        <Poster src={movie.poster} title={movie.title} />
      </Link>

      <div className={styles.info}>
        <Link to={`/movies/${movie.id}`} className={styles.title}>
          {movie.title}
        </Link>
        <div className={styles.meta}>
          <span className={styles.genre}>{movie.genreLabel}</span>
          <span>{movie.duration}</span>
          {details.rated && <span className={styles.rated}>{details.rated}</span>}
          {details.studio && <span>{details.studio}</span>}
        </div>
        <div className={styles.status}>
          {released ? (
            <>
              <span className={styles.released}>● เข้าฉายแล้ว</span>
              <span className={styles.score}>★ {movie.score}</span>
            </>
          ) : (
            <span className={styles.countdown}>
              {days === 1 ? "เข้าฉายพรุ่งนี้" : `อีก ${days} วัน`}
            </span>
          )}
        </div>
      </div>

      <button
        className={`${styles.listBtn} ${inList ? styles.listBtnOn : ""}`}
        onClick={() => watchlist.toggle(movie)}
        aria-pressed={inList}
      >
        <Icon name={inList ? "check" : "bookmark"} size={16} />
        <span>{inList ? "อยู่ในรายการ" : "อยากดู"}</span>
      </button>
    </article>
  );
}

export default function CalendarPage({ user, onToast }) {
  const [year, setYear] = useState("all");
  const watchlist = useWatchlistToggle(user, onToast);

  const upcoming = ENTRIES.filter((e) => daysUntil(e.date) > 0).reverse();
  const released = ENTRIES.filter(
    (e) => daysUntil(e.date) <= 0 && (year === "all" || e.date.getFullYear() === year)
  );

  const months = [];
  for (const e of released) {
    const key = monthKey(e.date);
    const last = months[months.length - 1];
    if (last?.key === key) last.items.push(e);
    else months.push({ key, label: monthLabel(e.date), items: [e] });
  }

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.container}>
          <nav className={styles.crumbs} aria-label="breadcrumb">
            <Link to="/">หน้าแรก</Link>
            <span>/</span>
            <span className={styles.crumbCurrent}>ปฏิทินฉาย</span>
          </nav>
          <h1 className={styles.pageTitle}>
            <Icon name="calendar" size={30} />
            ปฏิทินฉาย
          </h1>
          <p className={styles.subtitle}>
            ติดตามวันเข้าฉายของหนังแต่ละเรื่อง และเก็บเรื่องที่สนใจไว้ในรายการอยากดู
          </p>
        </div>
      </header>

      <div className={styles.container}>
        {/* ── กำลังจะเข้าฉาย ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.bar} />
            กำลังจะเข้าฉาย
          </h2>
          {upcoming.length ? (
            <div className={styles.timeline}>
              {upcoming.map((e) => (
                <ReleaseItem key={e.movie.id} entry={e} watchlist={watchlist} />
              ))}
            </div>
          ) : (
            <div className={styles.notice}>
              <Icon name="clock" size={20} />
              <span>
                ยังไม่มีหนังที่ประกาศวันเข้าฉายล่วงหน้าในระบบ
                ดูหนังที่เข้าฉายแล้วด้านล่าง หรือ{" "}
                <Link to="/movies?sort=upcoming">เรียกดูหนังล่าสุดทั้งหมด</Link>
              </span>
            </div>
          )}
        </section>

        {/* ── เข้าฉายแล้ว ── */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.bar} />
              เข้าฉายแล้ว
            </h2>
            <div className={styles.years} role="tablist" aria-label="ปีที่เข้าฉาย">
              {["all", ...YEARS].map((y) => (
                <button
                  key={y}
                  role="tab"
                  aria-selected={year === y}
                  className={`${styles.yearBtn} ${year === y ? styles.yearActive : ""}`}
                  onClick={() => setYear(y)}
                >
                  {y === "all" ? "ทั้งหมด" : y}
                </button>
              ))}
            </div>
          </div>

          {months.map((month) => (
            <div key={month.key} className={styles.month}>
              <h3 className={styles.monthTitle}>
                {month.label}
                <span className={styles.monthCount}>{month.items.length} เรื่อง</span>
              </h3>
              <div className={styles.timeline}>
                {month.items.map((e) => (
                  <ReleaseItem key={e.movie.id} entry={e} watchlist={watchlist} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
