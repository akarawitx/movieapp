import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MOVIES, FEATURED_REVIEW } from "../data/movies";
import HeroBanner from "../components/HeroBanner";
import StatsBar from "../components/StatsBar";
import GenreTabs from "../components/GenreTabs";
import MovieCard from "../components/MovieCard";
import MovieDetailModal from "../components/MovieDetailModal";

function SectionHeader({ title, onViewAll }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
      <h2 style={{ fontFamily: "'Prompt', sans-serif", fontSize: "18px", fontWeight: 700, display: "flex", alignItems: "center", gap: "10px", color: "#fff", margin: 0 }}>
        <span style={{ width: "4px", height: "18px", background: "#F5C518", borderRadius: "2px", display: "block" }} />
        {title}
      </h2>
      <button onClick={onViewAll} style={{ color: "#F5C518", background: "none", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'Prompt', sans-serif" }}>
        ดูทั้งหมด →
      </button>
    </div>
  )
}

// ✅ ใหม่ — ย้ายออกมาข้างนอก
const ArrowBtn = ({ dir, onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: 'absolute', top: '50%', transform: 'translateY(-50%)',
      [dir === 'left' ? 'left' : 'right']: '-16px',
      zIndex: 10,
      width: '40px', height: '40px', borderRadius: '50%',
      background: 'rgba(20,20,20,0.95)',
      border: '1px solid rgba(255,255,255,0.15)',
      color: '#fff', cursor: 'pointer', fontSize: '18px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      transition: 'all 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = '#F5C518'; e.currentTarget.style.color = '#000' }}
    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(20,20,20,0.95)'; e.currentTarget.style.color = '#fff' }}
  >
    {dir === 'left' ? '‹' : '›'}
  </button>
)

function MovieRow({ movies, onOpen, onWatchlist }) {
  const rowRef = useRef(null)
  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir === 'left' ? -600 : 600, behavior: 'smooth' })
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <ArrowBtn dir="left" onClick={() => scroll('left')} />
      <div ref={rowRef} style={{
        display: 'flex', gap: '14px',
        overflowX: 'auto', paddingBottom: '4px',
        scrollbarWidth: 'none', msOverflowStyle: 'none',
      }}>
        {movies.map(m => (
          <div key={m.id} style={{ flex: '0 0 175px' }}>
            <MovieCard movie={m} onOpen={onOpen} onWatchlist={onWatchlist} />
          </div>
        ))}
      </div>
      <ArrowBtn dir="right" onClick={() => scroll('right')} />
    </div>
  )
}

export default function HomePage({ user, onToast, searchQuery }) {
  const navigate = useNavigate();
  const [activeGenre, setActiveGenre] = useState("all");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const trendingRef = useRef(null);

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

  const scrollTrending = (dir) => {
    if (trendingRef.current) {
      trendingRef.current.scrollBy({
        left: dir === "left" ? -600 : 600,
        behavior: "smooth",
      });
    }
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
        <section id="trending" style={{ paddingTop: "48px" }}>
          <GenreTabs active={activeGenre} onChange={setActiveGenre} />
          <SectionHeader title="กำลังฮิตขณะนี้" onViewAll={() => navigate('/movies')} />

          {/* แถวเดียว เลื่อนซ้ายขวา */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => scrollTrending("left")}
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                left: "-16px",
                zIndex: 10,
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(20,20,20,0.95)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F5C518";
                e.currentTarget.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(20,20,20,0.95)";
                e.currentTarget.style.color = "#fff";
              }}
            >
              ‹
            </button>

            <div
              ref={trendingRef}
              style={{
                display: "flex",
                gap: "14px",
                overflowX: "auto",
                paddingBottom: "4px",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {(filtered.length ? filtered : MOVIES).map((m) => (
                <div key={m.id} style={{ flex: "0 0 175px" }}>
                  <MovieCard
                    movie={m}
                    onOpen={setSelectedMovie}
                    onWatchlist={handleWatchlist}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollTrending("right")}
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                right: "-16px",
                zIndex: 10,
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(20,20,20,0.95)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F5C518";
                e.currentTarget.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(20,20,20,0.95)";
                e.currentTarget.style.color = "#fff";
              }}
            >
              ›
            </button>
          </div>
        </section>

        {/* Top Rated */}
        <section id="toprated" style={{ paddingTop: "48px" }}>
          <SectionHeader title="คะแนนสูงสุด"    onViewAll={() => navigate('/movies')} />

          <MovieRow
            movies={topRated}
            onOpen={setSelectedMovie}
            onWatchlist={handleWatchlist}
          />
        </section>

        {/* Featured Review */}
        <section style={{ paddingTop: "48px" }}>
          <SectionHeader title="รีวิวแนะนำ"     onViewAll={() => navigate('/movies')} />

          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px",
              padding: "28px",
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "24px",
            }}
          >
            <div style={{ borderRadius: "10px", overflow: "hidden" }}>
              <img
                src={featuredMovie?.poster}
                alt=""
                style={{ width: "100%", display: "block" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#555",
                    marginBottom: "8px",
                    fontFamily: "'Prompt', sans-serif",
                  }}
                >
                  {featuredMovie?.title} ({featuredMovie?.year})
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: FEATURED_REVIEW.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#000",
                      fontFamily: "'Prompt', sans-serif",
                      flexShrink: 0,
                    }}
                  >
                    {FEATURED_REVIEW.initials}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "#fff",
                        fontFamily: "'Prompt', sans-serif",
                      }}
                    >
                      {FEATURED_REVIEW.reviewer}
                    </div>
                    <span
                      style={{
                        background: "rgba(245,197,24,0.15)",
                        color: "#F5C518",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 600,
                        fontFamily: "'Prompt', sans-serif",
                      }}
                    >
                      {FEATURED_REVIEW.badge}
                    </span>
                  </div>
                </div>
                <div
                  style={{ display: "flex", gap: "2px", marginBottom: "8px" }}
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      style={{
                        color:
                          i <= FEATURED_REVIEW.score / 2
                            ? "#F5C518"
                            : "#2A2A2A",
                        fontSize: "15px",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    color: "#aaa",
                    lineHeight: 1.75,
                    fontSize: "13px",
                    fontStyle: "italic",
                    fontFamily: "'Prompt', sans-serif",
                    margin: 0,
                  }}
                >
                  "{FEATURED_REVIEW.text}"
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                {[`❤ ${FEATURED_REVIEW.likes}`, "ความคิดเห็น", "อ่านต่อ →"].map(
                  (btn) => (
                    <button
                      key={btn}
                      style={{
                        background: "#222",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#aaa",
                        fontSize: "12px",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontFamily: "'Prompt', sans-serif",
                      }}
                    >
                      {btn}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming */}
        <section
          id="upcoming"
          style={{ paddingTop: "48px", paddingBottom: "64px" }}
        >
          <SectionHeader title="เร็วๆ นี้"      onViewAll={() => navigate('/movies')} />

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
