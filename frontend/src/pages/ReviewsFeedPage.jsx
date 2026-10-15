import { useState } from "react";
import { Link } from "react-router-dom";
import { MOVIES } from "../data/movies";
import { getAllReviews, REVIEWERS } from "../data/movieDetails";
import { useProfile } from "../context/ProfileContext";
import useLoginPrompt from "../hooks/useLoginPrompt";
import Avatar from "../components/Avatar";
import Poster from "../components/Poster";
import Icon from "../components/Icon";
import styles from "../css/pages/ReviewsFeedPage.module.css";

const PAGE_SIZE = 8;

const SORTS = [
  { id: "recent", label: "ล่าสุด" },
  { id: "popular", label: "ยอดนิยม" },
];

const SCORE_FILTERS = [
  { id: "all", label: "ทุกคะแนน", test: () => true },
  { id: "love", label: "ชื่นชอบมาก (9–10)", test: (s) => s >= 9 },
  { id: "mixed", label: "กลางๆ (6–8)", test: (s) => s >= 6 && s <= 8 },
  { id: "critical", label: "วิจารณ์ (≤5)", test: (s) => s <= 5 },
];

const GENRES = [...new Set(MOVIES.map((m) => m.genreLabel))];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });

// นักรีวิวที่ได้ยอดถูกใจรวมมากที่สุด
const TOP_REVIEWERS = REVIEWERS.map((r) => {
  const mine = getAllReviews(MOVIES).filter(({ review }) => review.username === r.username);
  return { ...r, count: mine.length, likes: mine.reduce((s, { review }) => s + review.likes, 0) };
})
  .sort((a, b) => b.likes - a.likes)
  .slice(0, 5);

function FeedCard({ entry, liked, onLike }) {
  const { movie, review, author } = entry;
  const [revealed, setRevealed] = useState(false);
  const hidden = review.spoiler && !revealed;
  const profileUrl = `/u/${author.username}`;

  return (
    <article className={`${styles.card} ${author.isMe ? styles.cardMine : ""}`}>
      <header className={styles.cardHead}>
        <Link to={profileUrl} className={styles.author}>
          <Avatar src={author.avatar} name={author.name} color={author.color} size={40} />
          <span>
            <span className={styles.authorName}>
              {author.name}
              {author.isMe && <span className={styles.meTag}>คุณ</span>}
            </span>
            <time className={styles.date}>{formatDate(review.date)}</time>
          </span>
        </Link>
        <span className={styles.score}>★ {review.score}/10</span>
      </header>

      <Link to={`/movies/${movie.id}`} className={styles.movie}>
        <span className={styles.moviePoster}>
          <Poster src={movie.poster} title={movie.title} />
        </span>
        <span>
          <span className={styles.movieTitle}>{movie.title}</span>
          <span className={styles.movieMeta}>
            {movie.year} · {movie.genreLabel} · ★ {movie.score}
          </span>
        </span>
      </Link>

      {review.title && <h3 className={styles.title}>{review.title}</h3>}
      <div className={styles.bodyWrap}>
        <p className={`${styles.body} ${hidden ? styles.blurred : ""}`}>{review.body}</p>
        {hidden && (
          <button className={styles.spoilerBtn} onClick={() => setRevealed(true)}>
            <Icon name="eye" size={15} />
            รีวิวนี้มีสปอยล์ — แตะเพื่ออ่าน
          </button>
        )}
      </div>

      <footer className={styles.cardFoot}>
        {author.isMe ? (
          <span className={styles.likesStatic}>♥ {review.likes}</span>
        ) : (
          <button
            className={`${styles.likeBtn} ${liked ? styles.liked : ""}`}
            onClick={onLike}
            aria-pressed={liked}
          >
            ♥ {review.likes + (liked ? 1 : 0)}
          </button>
        )}
        <Link to={`/movies/${movie.id}#reviews`} className={styles.more}>
          รีวิวทั้งหมดของเรื่องนี้ →
        </Link>
      </footer>
    </article>
  );
}

export default function ReviewsFeedPage({ user }) {
  const { profile, activity } = useProfile();
  const promptLogin = useLoginPrompt();
  const [sort, setSort] = useState("recent");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [genre, setGenre] = useState("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [liked, setLiked] = useState(() => new Set());

  const reviewerByUsername = Object.fromEntries(REVIEWERS.map((r) => [r.username, r]));

  // รีวิวของผู้ใช้ที่ล็อกอินอยู่ (จาก localStorage) รวมกับรีวิวจำลองของคนอื่น
  const myEntries =
    user && profile
      ? activity.reviews
          .map((r) => ({
            movie: MOVIES.find((m) => m.id === r.movieId),
            review: { ...r, likes: 0, spoiler: !!r.spoiler },
            author: {
              username: profile.username,
              name: `${profile.firstName} ${profile.lastName}`.trim() || profile.username,
              avatar: profile.avatar,
              isMe: true,
            },
          }))
          .filter((e) => e.movie)
      : [];

  const others = getAllReviews(MOVIES).map(({ movie, review }) => ({
    movie,
    review,
    author: { ...reviewerByUsername[review.username], isMe: false },
  }));

  const test = SCORE_FILTERS.find((f) => f.id === scoreFilter).test;
  const entries = [...myEntries, ...others]
    .filter((e) => test(e.review.score))
    .filter((e) => genre === "all" || e.movie.genreLabel === genre)
    .sort((a, b) =>
      sort === "popular"
        ? b.review.likes - a.review.likes
        : b.review.date.localeCompare(a.review.date)
    );

  const resetPaging = () => setVisible(PAGE_SIZE);

  const toggleLike = (id) => {
    if (!user) return promptLogin("เข้าสู่ระบบเพื่อกดถูกใจรีวิว");
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.container}>
          <nav className={styles.crumbs} aria-label="breadcrumb">
            <Link to="/">หน้าแรก</Link>
            <span>/</span>
            <span className={styles.crumbCurrent}>รีวิวจากชุมชน</span>
          </nav>
          <h1 className={styles.pageTitle}>รีวิวจากชุมชน</h1>
          <p className={styles.subtitle}>
            อ่านความคิดเห็นจากผู้ชมตัวจริง {(myEntries.length + others.length).toLocaleString()}{" "}
            รีวิว จากหนัง {MOVIES.length} เรื่อง
          </p>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.main}>
            <div className={styles.toolbar}>
              <div className={styles.tabs} role="tablist">
                {SORTS.map((s) => (
                  <button
                    key={s.id}
                    role="tab"
                    aria-selected={sort === s.id}
                    className={`${styles.tab} ${sort === s.id ? styles.tabActive : ""}`}
                    onClick={() => {
                      setSort(s.id);
                      resetPaging();
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className={styles.selects}>
                <label className={styles.selectWrap}>
                  <select
                    className={styles.select}
                    value={scoreFilter}
                    onChange={(e) => {
                      setScoreFilter(e.target.value);
                      resetPaging();
                    }}
                    aria-label="กรองตามคะแนน"
                  >
                    {SCORE_FILTERS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                  <Icon name="chevronDown" size={14} />
                </label>
                <label className={styles.selectWrap}>
                  <select
                    className={styles.select}
                    value={genre}
                    onChange={(e) => {
                      setGenre(e.target.value);
                      resetPaging();
                    }}
                    aria-label="กรองตามแนวหนัง"
                  >
                    <option value="all">ทุกแนว</option>
                    {GENRES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  <Icon name="chevronDown" size={14} />
                </label>
              </div>
            </div>

            {entries.length === 0 ? (
              <div className={styles.empty}>
                <p>ไม่มีรีวิวที่ตรงกับตัวกรองนี้</p>
                <button
                  className={styles.btnGhost}
                  onClick={() => {
                    setScoreFilter("all");
                    setGenre("all");
                  }}
                >
                  ล้างตัวกรอง
                </button>
              </div>
            ) : (
              <div className={styles.feed}>
                {entries.slice(0, visible).map((e) => (
                  <FeedCard
                    key={e.review.id}
                    entry={e}
                    liked={liked.has(e.review.id)}
                    onLike={() => toggleLike(e.review.id)}
                  />
                ))}
              </div>
            )}

            {visible < entries.length && (
              <button className={styles.moreBtn} onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                ดูรีวิวเพิ่มเติม ({entries.length - visible})
              </button>
            )}
          </div>

          <aside className={styles.aside}>
            <div className={styles.sideCard}>
              <h2 className={styles.sideTitle}>นักรีวิวยอดนิยม</h2>
              <ol className={styles.reviewers}>
                {TOP_REVIEWERS.map((r, i) => (
                  <li key={r.username}>
                    <Link to={`/u/${r.username}`} className={styles.reviewer}>
                      <span className={styles.reviewerRank}>{i + 1}</span>
                      <Avatar name={r.name} color={r.color} size={36} />
                      <span className={styles.reviewerText}>
                        <strong>{r.name}</strong>
                        <span>
                          {r.count} รีวิว · ♥ {r.likes.toLocaleString()}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            <div className={styles.ctaCard}>
              <Icon name="edit" size={22} />
              <strong>ดูหนังเรื่องไหนมาแล้วบ้าง?</strong>
              <p>แบ่งปันความคิดเห็นของคุณให้คนอื่นได้อ่าน</p>
              <Link to="/movies" className={styles.ctaBtn}>
                เลือกหนังที่จะรีวิว
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
