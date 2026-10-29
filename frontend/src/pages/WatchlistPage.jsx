import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";
import { useProfile } from "../context/ProfileContext";
import Icon from "../components/Icon";
import Poster from "../components/Poster";
import styles from "../css/pages/WatchlistPage.module.css";

const STATUS_TABS = [
  { id: "all", label: "ทั้งหมด" },
  { id: "unwatched", label: "ยังไม่ได้ดู" },
  { id: "watched", label: "ดูแล้ว" },
];

const SORTS = [
  { id: "added", label: "เพิ่มล่าสุด" },
  { id: "score", label: "คะแนนสูงสุด" },
  { id: "year", label: "ปีที่ฉายล่าสุด" },
  { id: "title", label: "ชื่อเรื่อง A–Z" },
  { id: "runtime", label: "ความยาวสั้นที่สุด" },
];

const VIEW_KEY = "pixelfilm.watchlist.view";

const toMinutes = (duration) => {
  const h = /(\d+)h/.exec(duration)?.[1] ?? 0;
  const m = /(\d+)m/.exec(duration)?.[1] ?? 0;
  return Number(h) * 60 + Number(m);
};

const formatRuntime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h} ชม. ${m} นาที` : `${m} นาที`;
};

function readView() {
  try {
    return localStorage.getItem(VIEW_KEY) === "list" ? "list" : "grid";
  } catch {
    return "grid";
  }
}

function EmptyWatchlist({ suggestions, onAdd }) {
  const navigate = useNavigate();
  return (
    <div className={styles.emptyAll}>
      <span className={styles.emptyIcon}>
        <Icon name="bookmark" size={34} />
      </span>
      <h2>รายการอยากดูยังว่างอยู่</h2>
      <p>กด “+ เพิ่มในรายการ” ที่หนังเรื่องไหนก็ได้ เพื่อเก็บไว้ดูทีหลัง</p>
      <button className={styles.btnPrimary} onClick={() => navigate("/movies")}>
        ค้นหาหนังที่น่าสนใจ
      </button>

      {suggestions.length > 0 && (
        <div className={styles.suggest}>
          <h3>แนะนำให้เริ่มจากเรื่องเหล่านี้</h3>
          <div className={styles.suggestGrid}>
            {suggestions.map((m) => (
              <div key={m.id} className={styles.suggestCard}>
                <Link to={`/movies/${m.id}`} className={styles.suggestPoster}>
                  <Poster src={m.poster} title={m.title} />
                  <span className={styles.scoreBadge}>★ {m.score}</span>
                </Link>
                <div className={styles.suggestTitle}>{m.title}</div>
                <button className={styles.suggestAdd} onClick={() => onAdd(m)}>
                  + เพิ่มในรายการ
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WatchlistItem({ movie, view, watched, reviewed, onToggleWatched, onRemove }) {
  const detailUrl = `/movies/${movie.id}`;

  const actions = (
    <div className={styles.itemActions}>
      <button
        className={`${styles.watchedBtn} ${watched ? styles.watchedOn : ""}`}
        onClick={onToggleWatched}
        aria-pressed={watched}
      >
        <Icon name="check" size={15} />
        {watched ? "ดูแล้ว" : "ดูจบแล้ว"}
      </button>
      <button
        className={styles.removeBtn}
        onClick={onRemove}
        aria-label={`นำ ${movie.title} ออกจากรายการ`}
        title="นำออกจากรายการ"
      >
        <Icon name="trash" size={16} />
      </button>
    </div>
  );

  const reviewLink =
    watched && !reviewed ? (
      <Link to={`${detailUrl}#write-review`} className={styles.reviewLink}>
        ★ ให้คะแนนเรื่องนี้
      </Link>
    ) : null;

  if (view === "list") {
    return (
      <article className={`${styles.row} ${watched ? styles.isWatched : ""}`}>
        <Link to={detailUrl} className={styles.rowPoster}>
          <Poster src={movie.poster} title={movie.title} />
          {watched && <span className={styles.watchedTag}>✓ ดูแล้ว</span>}
        </Link>
        <div className={styles.rowBody}>
          <Link to={detailUrl} className={styles.title}>
            {movie.title}
          </Link>
          <div className={styles.meta}>
            <span className={styles.score}>★ {movie.score}</span>
            <span>{movie.year}</span>
            <span>{movie.duration}</span>
            <span className={styles.genre}>{movie.genreLabel}</span>
          </div>
          <p className={styles.synopsis}>{movie.synopsis}</p>
          <div className={styles.director}>กำกับโดย {movie.director}</div>
        </div>
        <div className={styles.rowSide}>
          {actions}
          {reviewLink}
        </div>
      </article>
    );
  }

  return (
    <article className={`${styles.card} ${watched ? styles.isWatched : ""}`}>
      <Link to={detailUrl} className={styles.cardPoster}>
        <Poster src={movie.poster} title={movie.title} />
        <span className={styles.scoreBadge}>★ {movie.score}</span>
        {watched && <span className={styles.watchedTag}>✓ ดูแล้ว</span>}
      </Link>
      <div className={styles.cardBody}>
        <Link to={detailUrl} className={styles.title}>
          {movie.title}
        </Link>
        <div className={styles.meta}>
          <span>{movie.year}</span>
          <span>{movie.duration}</span>
          <span className={styles.genre}>{movie.genreLabel}</span>
        </div>
        {actions}
        {reviewLink}
      </div>
    </article>
  );
}

export default function WatchlistPage({ onToast }) {
  const {
    activity,
    isWatched,
    toggleWatched,
    toggleWatchlist,
    restoreWatchlist,
    addToWatchlist,
    getMyReview,
  } = useProfile();
  const { movies: MOVIES } = useCatalog();
  const [status, setStatus] = useState("all");
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState("added");
  const [view, setView] = useState(readView);
  const [removed, setRemoved] = useState(null);

  // แถบ "เลิกทำ" หายไปเองหลัง 6 วินาที
  useEffect(() => {
    if (!removed) return;
    const t = setTimeout(() => setRemoved(null), 6000);
    return () => clearTimeout(t);
  }, [removed]);

  const changeView = (v) => {
    setView(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* ไม่บันทึกก็ไม่เป็นไร */
    }
  };

  const items = activity.watchlist
    .map((id, index) => ({ movie: MOVIES.find((m) => m.id === id), index }))
    .filter((x) => x.movie);

  const watchedCount = items.filter((x) => isWatched(x.movie.id)).length;
  const remaining = items.filter((x) => !isWatched(x.movie.id));
  const remainingMins = remaining.reduce((s, x) => s + toMinutes(x.movie.duration), 0);
  const progress = items.length ? Math.round((watchedCount / items.length) * 100) : 0;

  const genres = [
    ...new Set(items.map(({ movie }) => movie.genreLabel)),
  ].map((label) => [label, label]);

  const counts = {
    all: items.length,
    unwatched: items.length - watchedCount,
    watched: watchedCount,
  };

  const sorter = {
    added: (a, b) => a.index - b.index,
    score: (a, b) => b.movie.score - a.movie.score,
    year: (a, b) => b.movie.year - a.movie.year,
    title: (a, b) => a.movie.title.localeCompare(b.movie.title),
    runtime: (a, b) => toMinutes(a.movie.duration) - toMinutes(b.movie.duration),
  }[sort];

  const visible = items
    .filter(({ movie }) =>
      status === "all" ? true : (status === "watched") === isWatched(movie.id)
    )
    .filter(({ movie }) => genre === "all" || movie.genreLabel === genre)
    .sort(sorter);

  const suggestions = [...MOVIES]
    .filter((m) => !activity.watchlist.includes(m.id))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const handleRemove = (movie, index) => {
    const wasWatched = isWatched(movie.id);
    toggleWatchlist(movie.id);
    setRemoved({ movie, index, wasWatched });
  };

  const handleUndo = () => {
    restoreWatchlist(removed.movie.id, removed.index, removed.wasWatched);
    setRemoved(null);
  };

  const handleToggleWatched = (movie) => {
    const now = toggleWatched(movie.id);
    if (now) onToast?.(`ดู "${movie.title}" แล้ว 🎬`, "✅");
  };

  const handleAdd = (movie) => {
    addToWatchlist(movie.id);
    onToast?.(`เพิ่ม "${movie.title}" ในรายการแล้ว`);
  };

  const resetFilters = () => {
    setStatus("all");
    setGenre("all");
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.container}>
          <nav className={styles.crumbs} aria-label="breadcrumb">
            <Link to="/">หน้าแรก</Link>
            <span>/</span>
            <Link to="/profile">โปรไฟล์ของฉัน</Link>
            <span>/</span>
            <span className={styles.crumbCurrent}>รายการอยากดู</span>
          </nav>

          <div className={styles.heroRow}>
            <div>
              <h1 className={styles.pageTitle}>
                <span className={styles.bar} />
                รายการอยากดู
              </h1>
              <p className={styles.subtitle}>
                {items.length
                  ? `หนัง ${items.length} เรื่องที่คุณเก็บไว้ดู`
                  : "เก็บหนังที่สนใจไว้ที่นี่ แล้วกลับมาดูเมื่อพร้อม"}
              </p>
            </div>

            {items.length > 0 && (
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <strong>{counts.unwatched}</strong>
                  <span>ยังไม่ได้ดู</span>
                </div>
                <div className={styles.stat}>
                  <strong>{watchedCount}</strong>
                  <span>ดูแล้ว</span>
                </div>
                <div className={styles.stat}>
                  <strong>{formatRuntime(remainingMins)}</strong>
                  <span>เวลาดูที่เหลือ</span>
                </div>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className={styles.progress}>
              <div className={styles.progressTrack}>
                <span style={{ width: `${progress}%` }} />
              </div>
              <span className={styles.progressLabel}>ดูไปแล้ว {progress}%</span>
            </div>
          )}
        </div>
      </header>

      <div className={styles.container}>
        {items.length === 0 ? (
          <EmptyWatchlist suggestions={suggestions} onAdd={handleAdd} />
        ) : (
          <>
            <div className={styles.toolbar}>
              <div className={styles.tabs} role="tablist">
                {STATUS_TABS.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={status === t.id}
                    className={`${styles.tab} ${status === t.id ? styles.tabActive : ""}`}
                    onClick={() => setStatus(t.id)}
                  >
                    {t.label}
                    <span className={styles.tabCount}>{counts[t.id]}</span>
                  </button>
                ))}
              </div>

              <div className={styles.controls}>
                <label className={styles.selectWrap}>
                  <select
                    className={styles.select}
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    aria-label="กรองตามแนวหนัง"
                  >
                    <option value="all">ทุกแนว</option>
                    {genres.map(([id, label]) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <Icon name="chevronDown" size={14} />
                </label>
                <label className={styles.selectWrap}>
                  <select
                    className={styles.select}
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="เรียงลำดับ"
                  >
                    {SORTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <Icon name="chevronDown" size={14} />
                </label>
                <div className={styles.viewToggle} role="group" aria-label="รูปแบบการแสดงผล">
                  <button
                    className={view === "grid" ? styles.viewActive : ""}
                    onClick={() => changeView("grid")}
                    aria-pressed={view === "grid"}
                    aria-label="แสดงแบบตาราง"
                  >
                    <Icon name="grid" size={16} />
                  </button>
                  <button
                    className={view === "list" ? styles.viewActive : ""}
                    onClick={() => changeView("list")}
                    aria-pressed={view === "list"}
                    aria-label="แสดงแบบรายการ"
                  >
                    <Icon name="list" size={16} />
                  </button>
                </div>
              </div>
            </div>

            {visible.length === 0 ? (
              <div className={styles.emptyFilter}>
                <p>
                  {status === "watched" && genre === "all"
                    ? "ยังไม่มีเรื่องที่ดูแล้ว ดูจบเมื่อไหร่ก็กด “ทำเครื่องหมายว่าดูแล้ว” ได้เลย"
                    : "ไม่มีหนังที่ตรงกับตัวกรองนี้"}
                </p>
                <button className={styles.btnGhost} onClick={resetFilters}>
                  ล้างตัวกรอง
                </button>
              </div>
            ) : (
              <div className={view === "grid" ? styles.grid : styles.list}>
                {visible.map(({ movie, index }) => (
                  <WatchlistItem
                    key={movie.id}
                    movie={movie}
                    view={view}
                    watched={isWatched(movie.id)}
                    reviewed={!!getMyReview(movie.id)}
                    onToggleWatched={() => handleToggleWatched(movie)}
                    onRemove={() => handleRemove(movie, index)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {removed && (
        <div className={styles.undoBar} role="status">
          <span>
            นำ “{removed.movie.title}” ออกจากรายการแล้ว
          </span>
          <button onClick={handleUndo}>เลิกทำ</button>
        </div>
      )}
    </div>
  );
}
