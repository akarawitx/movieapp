import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MOVIES } from "../data/movies";
import MovieCard from "../components/MovieCard";
import MovieDetailModal from "../components/MovieDetailModal";

const GENRES = [
  { id: "all", label: "ทั้งหมด" },
  { id: "action", label: "แอ็คชั่น" },
  { id: "scifi", label: "Sci-Fi" },
  { id: "drama", label: "ดราม่า" },
  { id: "horror", label: "สยองขวัญ" },
  { id: "comedy", label: "ตลก" },
  { id: "romance", label: "โรแมนติก" },
];

const YEARS = ["ทั้งหมด", "2024", "2023", "2022", "2021", "2020"];

const SCORES = [
  { id: "all", label: "ทั้งหมด" },
  { id: "9", label: "9.0+" },
  { id: "8", label: "8.0+" },
  { id: "7", label: "7.0+" },
  { id: "6", label: "6.0+" },
];

const SORTS = [
  { id: "score", label: "คะแนนสูงสุด" },
  { id: "newest", label: "ใหม่ล่าสุด" },
  { id: "reviews", label: "รีวิวเยอะสุด" },
];

function SidebarSection({ title, children }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <div
        style={{
          fontFamily: "'Prompt', sans-serif",
          fontSize: "13px",
          fontWeight: 700,
          color: "#fff",
          marginBottom: "12px",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            width: "3px",
            height: "14px",
            background: "#F5C518",
            borderRadius: "2px",
            display: "block",
          }}
        />
        {title}
      </div>
      {children}
    </div>
  );
}

function FilterBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: active ? "rgba(245,197,24,0.12)" : "none",
        border: `1px solid ${active ? "rgba(245,197,24,0.35)" : "transparent"}`,
        color: active ? "#F5C518" : "#888",
        padding: "7px 12px",
        borderRadius: "7px",
        cursor: "pointer",
        fontFamily: "'Prompt', sans-serif",
        fontSize: "13px",
        marginBottom: "2px",
        transition: "all 0.15s",
        fontWeight: active ? 600 : 400,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.color = "#ccc";
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.color = "#888";
          e.currentTarget.style.background = "none";
        }
      }}
    >
      {children}
    </button>
  );
}

export default function MovieBrowsePage({ user, onToast }) {
  const navigate = useNavigate();
  const [genre, setGenre] = useState("all");
  const [year, setYear] = useState("ทั้งหมด");
  const [score, setScore] = useState("all");
  const [sort, setSort] = useState("score");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let result = [...MOVIES];

    if (genre !== "all") result = result.filter((m) => m.genre === genre);
    if (year !== "ทั้งหมด")
      result = result.filter((m) => String(m.year) === year);
    if (score !== "all")
      result = result.filter((m) => m.score >= parseFloat(score));

    if (sort === "score") result.sort((a, b) => b.score - a.score);
    if (sort === "newest") result.sort((a, b) => b.year - a.year);
    if (sort === "reviews") result.sort((a, b) => b.reviews - a.reviews);

    return result;
  }, [genre, year, score, sort]);

  const handleWatchlist = (movie) => {
    if (!user) {
      onToast("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    onToast(`เพิ่ม "${movie.title}" ในรายการแล้ว`);
  };

  const resetAll = () => {
    setGenre("all");
    setYear("ทั้งหมด");
    setScore("all");
    setSort("score");
  };
  const hasFilter = genre !== "all" || year !== "ทั้งหมด" || score !== "all";

  return (
    <div
      style={{ paddingTop: "60px", minHeight: "100vh", background: "#0A0A0A" }}
    >
      <div className="container">
        <div style={{ paddingTop: "40px", paddingBottom: "64px" }}>
          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={() => navigate("/")}
              style={{
                background: "none",
                border: "none",
                color: "#888",
                fontSize: "13px",
                cursor: "pointer",
                padding: 0,
                fontFamily: "'Prompt', sans-serif",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F5C518")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
            >
              หน้าแรก
            </button>
            <span style={{ color: "#444", fontSize: "13px" }}>›</span>
            <span
              style={{
                color: "#fff",
                fontSize: "13px",
                fontFamily: "'Prompt', sans-serif",
              }}
            >
              รายการหนังทั้งหมด
            </span>
          </div>

          {/* Page Header */}
          <div style={{ marginBottom: "32px" }}>
            <h1
              style={{
                fontFamily: "'Prompt', sans-serif",
                fontSize: "28px",
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 6px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "28px",
                  background: "#F5C518",
                  borderRadius: "3px",
                  display: "block",
                }}
              />
              รายการหนังทั้งหมด
            </h1>
            <p
              style={{
                color: "#555",
                fontSize: "14px",
                fontFamily: "'Prompt', sans-serif",
                margin: 0,
                paddingLeft: "17px",
              }}
            >
              {filtered.length} เรื่อง
            </p>
          </div>

          {/* Layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "220px 1fr",
              gap: "32px",
              alignItems: "start",
            }}
          >
            {/* ── Sidebar ── */}
            <div
              style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "14px",
                padding: "20px",
                position: "sticky",
                top: "80px",
              }}
            >
              {/* Reset */}
              {hasFilter && (
                <button
                  onClick={resetAll}
                  style={{
                    width: "100%",
                    background: "rgba(229,9,20,0.1)",
                    border: "1px solid rgba(229,9,20,0.2)",
                    color: "#FF6B6B",
                    padding: "8px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontFamily: "'Prompt', sans-serif",
                    fontSize: "12px",
                    marginBottom: "20px",
                    fontWeight: 600,
                  }}
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              )}

              {/* แนวหนัง */}
              <SidebarSection title="แนวหนัง">
                {GENRES.map((g) => (
                  <FilterBtn
                    key={g.id}
                    active={genre === g.id}
                    onClick={() => setGenre(g.id)}
                  >
                    {g.label}
                  </FilterBtn>
                ))}
              </SidebarSection>

              {/* ปีที่ออกฉาย */}
              <SidebarSection title="ปีที่ออกฉาย">
                {YEARS.map((y) => (
                  <FilterBtn
                    key={y}
                    active={year === y}
                    onClick={() => setYear(y)}
                  >
                    {y}
                  </FilterBtn>
                ))}
              </SidebarSection>

              {/* ช่วงคะแนน */}
              <SidebarSection title="คะแนน">
                {SCORES.map((s) => (
                  <FilterBtn
                    key={s.id}
                    active={score === s.id}
                    onClick={() => setScore(s.id)}
                  >
                    {s.label}
                  </FilterBtn>
                ))}
              </SidebarSection>

              {/* เรียงลำดับ */}
              <SidebarSection title="เรียงลำดับ">
                {SORTS.map((s) => (
                  <FilterBtn
                    key={s.id}
                    active={sort === s.id}
                    onClick={() => setSort(s.id)}
                  >
                    {s.label}
                  </FilterBtn>
                ))}
              </SidebarSection>
            </div>

            {/* ── Grid ── */}
            <div>
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    🎬
                  </div>
                  <p
                    style={{
                      color: "#555",
                      fontFamily: "'Prompt', sans-serif",
                      fontSize: "16px",
                    }}
                  >
                    ไม่พบหนังที่ตรงกับตัวกรอง
                  </p>
                  <button
                    onClick={resetAll}
                    style={{
                      marginTop: "16px",
                      background: "#F5C518",
                      color: "#000",
                      border: "none",
                      padding: "10px 24px",
                      borderRadius: "8px",
                      fontFamily: "'Prompt', sans-serif",
                      fontSize: "14px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ล้างตัวกรอง
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(165px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {filtered.map((m) => (
                    <MovieCard
                      key={m.id}
                      movie={m}
                      onOpen={setSelected}
                      onWatchlist={handleWatchlist}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
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
