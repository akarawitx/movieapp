import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { MOVIES } from "../data/movies";
import { MOVIE_DETAILS } from "../data/movieDetails";
import { useProfile } from "../context/ProfileContext";
import useLoginPrompt from "../hooks/useLoginPrompt";
import MovieCard from "../components/MovieCard";
import ReviewSection from "../components/movie/ReviewSection";
import Icon from "../components/Icon";
import Poster from "../components/Poster";
import NotFoundPage from "./NotFoundPage";
import styles from "../css/pages/MovieDetailPage.module.css";

const SECTIONS = [
  { id: "overview", label: "ภาพรวม" },
  { id: "cast", label: "นักแสดงและทีมงาน" },
  { id: "reviews", label: "รีวิว" },
  { id: "similar", label: "หนังที่คล้ายกัน" },
];

const CAST_COLORS = ["#F5C518", "#00B4D8", "#2ECC71", "#E91E8B", "#FF6B35", "#9B59B6"];

const trailerUrl = (movie) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${movie.title} ${movie.year} official trailer`
  )}`;

const scrollToId = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

function getSimilar(movie) {
  const sameGenre = MOVIES.filter((m) => m.id !== movie.id && m.genre === movie.genre);
  const others = MOVIES.filter((m) => m.id !== movie.id && m.genre !== movie.genre).sort(
    (a, b) => b.score - a.score
  );
  return [...sameGenre, ...others].slice(0, 5);
}

// ไฮไลต์แท็บตาม section ที่กำลังเห็นอยู่บนจอ
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-130px 0px -60% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const SECTION_IDS = SECTIONS.map((s) => s.id);

export default function MovieDetailPage({ user, onToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const promptLogin = useLoginPrompt();
  const { isInWatchlist, toggleWatchlist, addToWatchlist, getMyReview } = useProfile();
  const active = useActiveSection(SECTION_IDS);
  const { hash } = useLocation();

  // ลิงก์แบบ /movies/:id#reviews → เลื่อนไปยัง section (รอให้ App เลื่อนขึ้นบนสุดเสร็จก่อน)
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => scrollToId(hash.slice(1)), 60);
    return () => clearTimeout(t);
  }, [id, hash]);

  const movie = MOVIES.find((m) => m.id === id);
  if (!movie) return <NotFoundPage />;

  const details = MOVIE_DETAILS[movie.id] ?? {};
  const inWatchlist = user && isInWatchlist(movie.id);
  const myReview = user ? getMyReview(movie.id) : null;
  const similar = getSimilar(movie);
  const people = [
    { name: movie.director, role: "ผู้กำกับ" },
    ...movie.cast.split(",").map((name, i) => ({
      name: name.trim(),
      role: i === 0 ? "นักแสดงนำ" : "นักแสดง",
    })),
  ];

  const handleWatchlist = () => {
    if (!user) return promptLogin("เข้าสู่ระบบเพื่อเพิ่มหนังในรายการอยากดู");
    const added = toggleWatchlist(movie.id);
    onToast(
      added ? `เพิ่ม "${movie.title}" ในรายการอยากดูแล้ว` : `นำ "${movie.title}" ออกจากรายการแล้ว`,
      added ? "✅" : "➖"
    );
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      onToast("คัดลอกลิงก์แล้ว", "🔗");
    } catch {
      onToast("คัดลอกลิงก์ไม่สำเร็จ", "⚠️");
    }
  };

  const handleRate = () => {
    if (!user) return promptLogin("เข้าสู่ระบบเพื่อให้คะแนนหนังเรื่องนี้");
    scrollToId("write-review");
  };

  const handleSimilarWatchlist = (m) => {
    if (!user) return promptLogin("เข้าสู่ระบบเพื่อเพิ่มหนังในรายการอยากดู");
    addToWatchlist(m.id);
    onToast(`เพิ่ม "${m.title}" ในรายการอยากดูแล้ว`);
  };

  const releaseDate = details.releaseDate
    ? new Date(details.releaseDate).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "–";

  const facts = [
    { label: "วันที่เข้าฉาย", value: releaseDate },
    { label: "ความยาว", value: movie.duration },
    { label: "เรตติ้ง", value: details.rated },
    { label: "แนว", value: movie.genreLabel },
    { label: "ภาษา", value: details.language },
    { label: "ประเทศ", value: details.country },
    { label: "ผู้กำกับ", value: movie.director },
    { label: "สตูดิโอ", value: details.studio },
  ].filter((f) => f.value);

  return (
    <div className={styles.page}>
      {/* ═════════ Hero ═════════ */}
      <section className={styles.hero}>
        <div className={styles.backdrop}>
          <img
            src={movie.backdrop || movie.poster}
            alt=""
            onError={(e) => {
              e.target.src = movie.poster;
            }}
          />
        </div>
        <div className={styles.heroShade} />

        <div className={styles.heroInner}>
          <nav className={styles.crumbs} aria-label="breadcrumb">
            <Link to="/">หน้าแรก</Link>
            <span>/</span>
            <Link to="/movies">รายการหนังทั้งหมด</Link>
            <span>/</span>
            <span className={styles.crumbCurrent}>{movie.title}</span>
          </nav>

          <div className={styles.heroGrid}>
            <div className={styles.poster}>
              <Poster src={movie.poster} title={movie.title} alt={`โปสเตอร์ ${movie.title}`} />
            </div>

            <div className={styles.heroInfo}>
              <div className={styles.heroHead}>
                <div className={styles.badges}>
                  <Link to={`/movies?genre=${movie.genre}`} className={styles.genreBadge}>
                    {movie.genreLabel}
                  </Link>
                  {details.rated && <span className={styles.ratedBadge}>{details.rated}</span>}
                </div>

                <h1 className={styles.title}>{movie.title}</h1>
                <div className={styles.meta}>
                  <span>{movie.year}</span>
                  <span className={styles.dot} />
                  <span>{movie.duration}</span>
                  <span className={styles.dot} />
                  <span>กำกับโดย {movie.director}</span>
                </div>
              </div>

              <div className={styles.scores}>
                <div className={styles.scoreBlock}>
                  <span className={styles.scoreStar}>★</span>
                  <div>
                    <div className={styles.scoreValue}>
                      {movie.score.toFixed(1)}
                      <span>/10</span>
                    </div>
                    <div className={styles.scoreLabel}>
                      คะแนน PixelFilm · {movie.reviews.toLocaleString()} รีวิว
                    </div>
                  </div>
                </div>
                <button className={styles.myScore} onClick={handleRate}>
                  {myReview ? (
                    <>
                      <span className={styles.myScoreValue}>★ {myReview.score}</span>
                      <span className={styles.scoreLabel}>คะแนนของคุณ</span>
                    </>
                  ) : (
                    <>
                      <span className={styles.myScoreEmpty}>☆ ให้คะแนน</span>
                      <span className={styles.scoreLabel}>คุณคิดอย่างไร?</span>
                    </>
                  )}
                </button>
              </div>

              <p className={styles.tagline}>{movie.synopsis}</p>

              <div className={styles.actions}>
                <a
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  href={trailerUrl(movie)}
                  target="_blank"
                  rel="noreferrer"
                >
                  ▶ ดูตัวอย่าง
                </a>
                <button
                  className={`${styles.btn} ${inWatchlist ? styles.btnActive : styles.btnSecondary}`}
                  onClick={handleWatchlist}
                  aria-pressed={!!inWatchlist}
                >
                  <Icon name="bookmark" size={16} />
                  {inWatchlist ? "อยู่ในรายการอยากดู" : "เพิ่มในรายการอยากดู"}
                </button>
                <button
                  className={`${styles.btn} ${styles.btnIcon}`}
                  onClick={handleShare}
                  aria-label="คัดลอกลิงก์"
                  title="คัดลอกลิงก์"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ Sticky section nav ═════════ */}
      <nav className={styles.subnav} aria-label="ส่วนของหน้า">
        <div className={styles.subnavInner}>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`${styles.subnavBtn} ${active === s.id ? styles.subnavActive : ""}`}
              onClick={() => scrollToId(s.id)}
            >
              {s.label}
              {s.id === "reviews" && (
                <span className={styles.subnavCount}>{movie.reviews.toLocaleString()}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* ═════════ Content ═════════ */}
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.main}>
            <section id="overview" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.bar} />
                เรื่องย่อ
              </h2>
              <p className={styles.synopsis}>{movie.synopsis}</p>

              <a
                className={styles.trailer}
                href={trailerUrl(movie)}
                target="_blank"
                rel="noreferrer"
              >
                <img src={movie.backdrop || movie.poster} alt="" />
                <span className={styles.trailerShade} />
                <span className={styles.play}>▶</span>
                <span className={styles.trailerText}>
                  <strong>ตัวอย่างภาพยนตร์</strong>
                  <span>ดูบน YouTube ↗</span>
                </span>
              </a>
            </section>

            <section id="cast" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.bar} />
                นักแสดงและทีมงาน
              </h2>
              <div className={styles.castGrid}>
                {people.map((p, i) => (
                  <div key={p.name} className={styles.person}>
                    <span
                      className={styles.personAvatar}
                      style={{ background: CAST_COLORS[i % CAST_COLORS.length] }}
                    >
                      {p.name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <span className={styles.personName}>{p.name}</span>
                    <span className={styles.personRole}>{p.role}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="reviews" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.bar} />
                รีวิวจากผู้ชม
              </h2>
              <ReviewSection key={movie.id} movie={movie} user={user} onToast={onToast} />
            </section>
          </div>

          <aside className={styles.aside}>
            <div className={styles.factsCard}>
              <h3 className={styles.asideTitle}>ข้อมูลภาพยนตร์</h3>
              <dl className={styles.facts}>
                {facts.map((f) => (
                  <div key={f.label} className={styles.fact}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className={styles.ctaCard}>
              <Icon name="bookmark" size={22} />
              <p>
                {inWatchlist
                  ? "หนังเรื่องนี้อยู่ในรายการอยากดูของคุณแล้ว"
                  : "ยังไม่ได้ดู? เก็บไว้ในรายการอยากดูก่อน"}
              </p>
              <button
                className={`${styles.btn} ${inWatchlist ? styles.btnActive : styles.btnPrimary}`}
                onClick={handleWatchlist}
              >
                {inWatchlist ? "✓ อยู่ในรายการแล้ว" : "+ เพิ่มในรายการ"}
              </button>
            </div>
          </aside>
        </div>

        <section id="similar" className={`${styles.section} ${styles.similar}`}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.bar} />
            หนังที่คล้ายกัน
          </h2>
          <div className={styles.similarGrid}>
            {similar.map((m) => (
              <MovieCard
                key={m.id}
                movie={m}
                onOpen={() => navigate(`/movies/${m.id}`)}
                onWatchlist={handleSimilarWatchlist}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
