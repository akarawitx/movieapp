import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MOVIES, FEATURED_REVIEW } from "../data/movies";
import HeroBanner from "../components/HeroBanner";
import StatsBar from "../components/StatsBar";
import GenreTabs from "../components/GenreTabs";
import MovieCard from "../components/MovieCard";
import MovieDetailModal from "../components/MovieDetailModal";
import styles from "../css/pages/HomePage.module.css";

function SectionHeader({ title, onViewAll }) {
  return (
    <div className={styles.sectionHeader}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.sectionBar} />
        {title}
      </h2>
      <button className={styles.viewAll} onClick={onViewAll}>
        ดูทั้งหมด
      </button>
    </div>
  );
}

const ArrowBtn = ({ dir, onClick }) => (
  <button
    onClick={onClick}
    className={`${styles.arrow} ${dir === "left" ? styles.arrowLeft : styles.arrowRight}`}
  >
    {dir === "left" ? "‹" : "›"}
  </button>
);

function MovieRow({ movies, onOpen, onWatchlist }) {
  const rowRef = useRef(null);
  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({
        left: dir === "left" ? -600 : 600,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={styles.rowWrap}>
      <ArrowBtn dir="left" onClick={() => scroll("left")} />
      <div ref={rowRef} className={styles.row}>
        {movies.map((m) => (
          <div key={m.id} className={styles.rowItem}>
            <MovieCard movie={m} onOpen={onOpen} onWatchlist={onWatchlist} />
          </div>
        ))}
      </div>
      <ArrowBtn dir="right" onClick={() => scroll("right")} />
    </div>
  );
}

export default function HomePage({ user, onToast, searchQuery }) {
  const navigate = useNavigate();
  const [activeGenre, setActiveGenre] = useState("all");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const filtered = searchQuery
    ? MOVIES.filter(
        (m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.genreLabel.includes(searchQuery),
      )
    : activeGenre === "all"
      ? MOVIES
      : MOVIES.filter((m) => m.genre === activeGenre);

  const topRated = [...MOVIES].sort((a, b) => b.score - a.score);
  const upcoming = [...MOVIES].reverse();
  const heroMovie = MOVIES[0];
  const featuredMovie = MOVIES.find((m) => m.id === FEATURED_REVIEW.movieId);

  const handleWatchlist = (movie) => {
    if (!user) {
      onToast("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    onToast(`เพิ่ม "${movie.title}" ในรายการแล้ว`);
  };

  return (
    <div>
      {/* Hero - เต็มความกว้าง */}
      <HeroBanner
        movie={heroMovie}
        onOpen={setSelectedMovie}
        onWatchlist={handleWatchlist}
      />

      {/* Container สำหรับทุกส่วนที่เหลือ */}
      <div className="container">
        <StatsBar />

        {/* Trending Section */}
        <section id="trending" className={styles.section}>
          <GenreTabs active={activeGenre} onChange={setActiveGenre} />
          <SectionHeader
            title="กำลังฮิตขณะนี้"
            onViewAll={() => navigate(`/movies?genre=${activeGenre}`)}
          />
          <MovieRow
            movies={filtered.length ? filtered : MOVIES}
            onOpen={setSelectedMovie}
            onWatchlist={handleWatchlist}
          />
        </section>

        {/* Top Rated */}
        <section id="toprated" className={styles.section}>
          <SectionHeader
            title="คะแนนสูงสุด"
            onViewAll={() => navigate("/movies?sort=score")}
          />
          <MovieRow
            movies={topRated}
            onOpen={setSelectedMovie}
            onWatchlist={handleWatchlist}
          />
        </section>

        {/* Featured Review */}
        <section className={styles.section}>
          <SectionHeader
            title="รีวิวแนะนำ"
            onViewAll={() => navigate("/movies?sort=reviews")}
          />

          <div className={styles.featured}>
            <div className={styles.featuredPoster}>
              <img
                className={styles.featuredPosterImg}
                src={featuredMovie?.poster}
                alt=""
              />
            </div>
            <div className={styles.featuredBody}>
              <div>
                <div className={styles.featuredMovie}>
                  {featuredMovie?.title} ({featuredMovie?.year})
                </div>
                <div className={styles.reviewer}>
                  {/* สีพื้นหลังมาจากข้อมูล จึงเก็บเป็น inline style ไว้ */}
                  <div
                    className={styles.reviewerAvatar}
                    style={{ background: FEATURED_REVIEW.color }}
                  >
                    {FEATURED_REVIEW.initials}
                  </div>
                  <div>
                    <div className={styles.reviewerName}>
                      {FEATURED_REVIEW.reviewer}
                    </div>
                    <span className={styles.reviewerBadge}>
                      {FEATURED_REVIEW.badge}
                    </span>
                  </div>
                </div>
                <div className={styles.stars}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className={`${styles.star} ${
                        i <= FEATURED_REVIEW.score / 2 ? styles.starOn : ""
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className={styles.quote}>"{FEATURED_REVIEW.text}"</p>
              </div>
              <div className={styles.featuredActions}>
                {[`❤ ${FEATURED_REVIEW.likes}`, "ความคิดเห็น", "อ่านต่อ →"].map(
                  (btn) => (
                    <button key={btn} className={styles.chip}>
                      {btn}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming */}
        <section id="upcoming" className={styles.sectionLast}>
          <SectionHeader
            title="เร็วๆ นี้"
            onViewAll={() => navigate("/movies?sort=upcoming")}
          />
          <MovieRow
            movies={upcoming}
            onOpen={setSelectedMovie}
            onWatchlist={handleWatchlist}
          />
        </section>
      </div>

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          user={user}
          onClose={() => setSelectedMovie(null)}
          onToast={onToast}
        />
      )}
    </div>
  );
}
