import { useState } from "react";
import { Link } from "react-router-dom";
import { MOVIES } from "../data/movies";
import { MOVIE_DETAILS } from "../data/movieDetails";
import { useProfile } from "../context/ProfileContext";
import useWatchlistToggle from "../hooks/useWatchlistToggle";
import Poster from "../components/Poster";
import Icon from "../components/Icon";
import styles from "../css/pages/ChartsPage.module.css";

const CHARTS = [
  {
    id: "top",
    label: "คะแนนสูงสุด",
    desc: "หนังที่ได้คะแนนเฉลี่ยจากผู้ชมสูงที่สุด",
    sort: (a, b) => b.score - a.score || b.reviews - a.reviews,
  },
  {
    id: "popular",
    label: "รีวิวมากที่สุด",
    desc: "หนังที่ผู้ชมพูดถึงและเขียนรีวิวมากที่สุด",
    sort: (a, b) => b.reviews - a.reviews,
  },
];

// กรองตาม genreLabel (ข้อความที่ผู้ใช้เห็นบนการ์ด) — บางเรื่องมี genre id ซ้ำกันแต่ป้ายต่างกัน
const GENRES = [
  { id: "all", label: "ทุกแนว" },
  ...[...new Set(MOVIES.map((m) => m.genreLabel))].map((label) => ({ id: label, label })),
];
const YEARS = ["all", ...[...new Set(MOVIES.map((m) => m.year))].sort((a, b) => b - a)];

export default function ChartsPage({ user, onToast }) {
  const [chartId, setChartId] = useState("top");
  const [genre, setGenre] = useState("all");
  const [year, setYear] = useState("all");
  const { getMyReview } = useProfile();
  const watchlist = useWatchlistToggle(user, onToast);

  const chart = CHARTS.find((c) => c.id === chartId);
  const maxReviews = Math.max(...MOVIES.map((m) => m.reviews));

  const ranked = MOVIES.filter(
    (m) => (genre === "all" || m.genreLabel === genre) && (year === "all" || m.year === year)
  ).sort(chart.sort);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.container}>
          <nav className={styles.crumbs} aria-label="breadcrumb">
            <Link to="/">หน้าแรก</Link>
            <span>/</span>
            <span className={styles.crumbCurrent}>Top Charts</span>
          </nav>
          <h1 className={styles.title}>
            <span className={styles.trophy}>🏆</span> Top Charts
          </h1>
          <p className={styles.subtitle}>{chart.desc} อัปเดตจากรีวิวของผู้ใช้ PixelFilm</p>

          <div className={styles.chartTabs} role="tablist">
            {CHARTS.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={chartId === c.id}
                className={`${styles.chartTab} ${chartId === c.id ? styles.chartTabActive : ""}`}
                onClick={() => setChartId(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.filters}>
          <div className={styles.chips}>
            {GENRES.map((g) => (
              <button
                key={g.id}
                className={`${styles.chip} ${genre === g.id ? styles.chipActive : ""}`}
                aria-pressed={genre === g.id}
                onClick={() => setGenre(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>
          <label className={styles.selectWrap}>
            <select
              className={styles.select}
              value={year}
              onChange={(e) => setYear(e.target.value === "all" ? "all" : Number(e.target.value))}
              aria-label="ปีที่ฉาย"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y === "all" ? "ทุกปี" : `ปี ${y}`}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={14} />
          </label>
        </div>

        {ranked.length === 0 ? (
          <div className={styles.empty}>
            <p>ไม่มีหนังที่ตรงกับตัวกรองนี้</p>
            <button
              className={styles.btnGhost}
              onClick={() => {
                setGenre("all");
                setYear("all");
              }}
            >
              ล้างตัวกรอง
            </button>
          </div>
        ) : (
          <ol className={styles.list}>
            {ranked.map((m, i) => {
              const rank = i + 1;
              const mine = getMyReview(m.id);
              const inList = watchlist.inList(m);
              const details = MOVIE_DETAILS[m.id] ?? {};
              return (
                <li key={m.id} className={`${styles.row} ${rank <= 3 ? styles[`top${rank}`] : ""}`}>
                  <span className={styles.rank} aria-label={`อันดับ ${rank}`}>
                    {rank}
                  </span>

                  <Link to={`/movies/${m.id}`} className={styles.poster}>
                    <Poster src={m.poster} title={m.title} />
                  </Link>

                  <div className={styles.info}>
                    <Link to={`/movies/${m.id}`} className={styles.movieTitle}>
                      {m.title}
                    </Link>
                    <div className={styles.meta}>
                      <span>{m.year}</span>
                      <span>{m.duration}</span>
                      {details.rated && <span className={styles.rated}>{details.rated}</span>}
                      <span className={styles.genre}>{m.genreLabel}</span>
                    </div>
                    <div className={styles.director}>กำกับโดย {m.director}</div>
                  </div>

                  <div className={styles.stats}>
                    {chartId === "top" ? (
                      <>
                        <div className={styles.score}>
                          <span className={styles.star}>★</span>
                          {m.score.toFixed(1)}
                        </div>
                        <div className={styles.statLabel}>
                          {m.reviews.toLocaleString()} รีวิว
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.score}>{m.reviews.toLocaleString()}</div>
                        <div className={styles.bar}>
                          <span style={{ width: `${(m.reviews / maxReviews) * 100}%` }} />
                        </div>
                        <div className={styles.statLabel}>รีวิว · ★ {m.score.toFixed(1)}</div>
                      </>
                    )}
                    {mine && <div className={styles.mine}>คุณให้ ★ {mine.score}</div>}
                  </div>

                  <button
                    className={`${styles.listBtn} ${inList ? styles.listBtnOn : ""}`}
                    onClick={() => watchlist.toggle(m)}
                    aria-pressed={inList}
                    aria-label={inList ? "นำออกจากรายการอยากดู" : "เพิ่มในรายการอยากดู"}
                    title={inList ? "อยู่ในรายการอยากดู" : "เพิ่มในรายการอยากดู"}
                  >
                    <Icon name={inList ? "check" : "bookmark"} size={18} />
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
