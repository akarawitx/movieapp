import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MOVIES } from "../data/movies";
import { searchMovies, searchReviews } from "../utils/search";
import { useProfile } from "../context/ProfileContext";
import useLoginPrompt from "../hooks/useLoginPrompt";
import MovieCard from "../components/MovieCard";
import MovieDetailModal from "../components/MovieDetailModal";
import Highlight from "../components/Highlight";
import Icon from "../components/Icon";
import styles from "../css/pages/SearchPage.module.css";

const POPULAR = ["Dune", "Nolan", "Sci-Fi", "ดราม่า", "Ryan Reynolds", "สยองขวัญ"];

const SORTS = [
  { id: "relevance", label: "ตรงที่สุด" },
  { id: "score", label: "คะแนนสูงสุด" },
  { id: "year", label: "ใหม่ล่าสุด" },
];

const REVIEW_PAGE = 6;

export default function SearchPage({ user, onToast }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const query = (params.get("q") ?? "").trim();
  const { addToWatchlist } = useProfile();
  const promptLogin = useLoginPrompt();

  const [draft, setDraft] = useState(query);
  const [tab, setTab] = useState("movies");
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState("relevance");
  const [reviewLimit, setReviewLimit] = useState(REVIEW_PAGE);
  const [selected, setSelected] = useState(null);

  const movies = searchMovies(query);
  const reviews = searchReviews(query);
  const genres = [...new Map(movies.map((m) => [m.genre, m.genreLabel])).entries()];

  const shownMovies = movies
    .filter((m) => genre === "all" || m.genre === genre)
    .sort(
      {
        relevance: () => 0,
        score: (a, b) => b.score - a.score,
        year: (a, b) => b.year - a.year,
      }[sort]
    );

  const runSearch = (q) => {
    const next = q.trim();
    if (next) navigate(`/search?q=${encodeURIComponent(next)}`);
  };

  const handleWatchlist = (movie) => {
    if (!user) return promptLogin("เข้าสู่ระบบเพื่อเพิ่มหนังในรายการอยากดู");
    addToWatchlist(movie.id);
    onToast(`เพิ่ม "${movie.title}" ในรายการแล้ว`);
  };

  const total = movies.length + reviews.length;
  const topRated = [...MOVIES].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.container}>
          <form
            className={styles.bigSearch}
            onSubmit={(e) => {
              e.preventDefault();
              runSearch(draft);
            }}
            role="search"
          >
            <Icon name="search" size={20} />
            <input
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="ค้นหาหนัง ผู้กำกับ นักแสดง หรือแนวหนัง"
              aria-label="ค้นหา"
            />
            <button type="submit" className={styles.searchBtn}>
              ค้นหา
            </button>
          </form>

          {query ? (
            <p className={styles.summary}>
              {total ? (
                <>
                  พบ <strong>{total}</strong> ผลลัพธ์สำหรับ <strong>“{query}”</strong>
                </>
              ) : (
                <>
                  ไม่พบผลลัพธ์สำหรับ <strong>“{query}”</strong>
                </>
              )}
            </p>
          ) : (
            <p className={styles.summary}>พิมพ์ชื่อหนัง ชื่อผู้กำกับ นักแสดง หรือแนวหนังที่สนใจ</p>
          )}
        </div>
      </header>

      <div className={styles.container}>
        {!query || total === 0 ? (
          /* ── ยังไม่ได้ค้น / ไม่พบผลลัพธ์ ── */
          <div className={styles.idle}>
            {query && (
              <ul className={styles.tips}>
                <li>ตรวจสอบการสะกดคำ</li>
                <li>ลองใช้คำที่สั้นลง หรือค้นด้วยชื่อภาษาอังกฤษ</li>
                <li>ลองค้นจากชื่อผู้กำกับ นักแสดง หรือแนวหนัง</li>
              </ul>
            )}
            <h2 className={styles.idleTitle}>คำค้นยอดนิยม</h2>
            <div className={styles.chips}>
              {POPULAR.map((p) => (
                <button
                  key={p}
                  className={styles.chip}
                  onClick={() => {
                    setDraft(p);
                    runSearch(p);
                  }}
                >
                  <Icon name="search" size={13} />
                  {p}
                </button>
              ))}
            </div>

            <h2 className={styles.idleTitle}>หนังคะแนนสูงที่น่าสนใจ</h2>
            <div className={styles.grid}>
              {topRated.map((m) => (
                <MovieCard
                  key={m.id}
                  movie={m}
                  onOpen={setSelected}
                  onWatchlist={handleWatchlist}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className={styles.tabs} role="tablist">
              {[
                { id: "movies", label: "หนัง", count: movies.length },
                { id: "reviews", label: "รีวิว", count: reviews.length },
              ].map((t) => (
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

            {tab === "movies" &&
              (movies.length === 0 ? (
                <p className={styles.emptyTab}>ไม่พบหนังที่ตรงกับคำค้นนี้ ลองดูในแท็บรีวิว</p>
              ) : (
                <>
                  <div className={styles.toolbar}>
                    <div className={styles.chips}>
                      {[["all", "ทุกแนว"], ...genres].map(([id, label]) => (
                        <button
                          key={id}
                          className={`${styles.chip} ${genre === id ? styles.chipActive : ""}`}
                          aria-pressed={genre === id}
                          onClick={() => setGenre(id)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
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
                  </div>
                  <div className={styles.grid}>
                    {shownMovies.map((m) => (
                      <MovieCard
                        key={m.id}
                        movie={m}
                        onOpen={setSelected}
                        onWatchlist={handleWatchlist}
                      />
                    ))}
                  </div>
                </>
              ))}

            {tab === "reviews" &&
              (reviews.length === 0 ? (
                <p className={styles.emptyTab}>ไม่พบรีวิวที่ตรงกับคำค้นนี้</p>
              ) : (
                <>
                  <div className={styles.reviewList}>
                    {reviews.slice(0, reviewLimit).map(({ movie, review }) => (
                      <Link
                        key={review.id}
                        to={`/movies/${movie.id}#reviews`}
                        className={styles.review}
                      >
                        <img className={styles.reviewPoster} src={movie.poster} alt="" />
                        <div className={styles.reviewBody}>
                          <div className={styles.reviewTop}>
                            <span className={styles.reviewMovie}>
                              <Highlight text={movie.title} query={query} className={styles.mark} />
                            </span>
                            <span className={styles.reviewScore}>★ {review.score}/10</span>
                          </div>
                          <div className={styles.reviewTitle}>
                            <Highlight text={review.title} query={query} className={styles.mark} />
                          </div>
                          <p className={styles.reviewText}>
                            {review.spoiler ? (
                              <em>รีวิวนี้มีสปอยล์ — อ่านได้ในหน้ารายละเอียด</em>
                            ) : (
                              <Highlight text={review.body} query={query} className={styles.mark} />
                            )}
                          </p>
                          <div className={styles.reviewMeta}>
                            โดย{" "}
                            <Highlight text={review.name} query={query} className={styles.mark} /> ·
                            ♥ {review.likes}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {reviewLimit < reviews.length && (
                    <button
                      className={styles.moreBtn}
                      onClick={() => setReviewLimit((n) => n + REVIEW_PAGE)}
                    >
                      ดูรีวิวเพิ่มเติม ({reviews.length - reviewLimit})
                    </button>
                  )}
                </>
              ))}
          </>
        )}
      </div>

      {selected && (
        <MovieDetailModal
          movie={selected}
          user={user}
          onClose={() => setSelected(null)}
          onToast={onToast}
        />
      )}
    </div>
  );
}
