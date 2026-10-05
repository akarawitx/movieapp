import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MOVIES } from "../data/movies";
import MovieCard from "../components/MovieCard";
import MovieDetailModal from "../components/MovieDetailModal";
import styles from "../css/pages/MovieBrowsePage.module.css";

const GENRES = [
  { id: "all", label: "ทั้งหมด" },
  { id: "action", label: "แอ็คชั่น" },
  { id: "scifi", label: "Sci-Fi" },
  { id: "drama", label: "ดราม่า" },
  { id: "horror", label: "สยองขวัญ" },
  { id: "comedy", label: "ตลก" },
  { id: "romance", label: "โรแมนติก" },
];

const SORTS = [
  { id: "score", label: "คะแนนสูงสุด" },
  { id: "newest", label: "ใหม่ล่าสุด" },
  { id: "reviews", label: "รีวิวเยอะสุด" },
  { id: "upcoming", label: "เร็วๆ นี้" },
];

function DualSlider({ min, max, step, value, onChange }) {
  const getPercent = (val) => ((val - min) / (max - min)) * 100;

  const handleMin = (e) => {
    const newMin = Math.min(Number(e.target.value), value[1] - step);
    onChange([newMin, value[1]]);
  };

  const handleMax = (e) => {
    const newMax = Math.max(Number(e.target.value), value[0] + step);
    onChange([value[0], newMax]);
  };

  const minPercent = getPercent(value[0]);
  const maxPercent = getPercent(value[1]);

  return (
    <div className={styles.sliderWrap}>
      {/* Track */}
      <div className={styles.track} />

      {/* Active Track — left/width ขึ้นกับค่าที่เลื่อน จึงเก็บเป็น inline style */}
      <div
        className={styles.trackActive}
        style={{
          left: `${minPercent}%`,
          width: `${maxPercent - minPercent}%`,
        }}
      />

      <div className={styles.slider}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleMin}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={handleMax}
        />
      </div>
    </div>
  );
}

function SidebarSection({ title, children }) {
  return (
    <div className={styles.sideSection}>
      <div className={styles.sideTitle}>
        <span className={styles.sideBar} />
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
      className={`${styles.filterBtn} ${active ? styles.filterBtnActive : ""}`}
    >
      {children}
    </button>
  );
}

export default function MovieBrowsePage({ user, onToast }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const yearDropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(e.target)
      ) {
        setYearOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initGenre = searchParams.get("genre");
  const [genre, setGenre] = useState(
    GENRES.some((g) => g.id === initGenre) ? initGenre : "all",
  );
  const [year, setYear] = useState("all");
  const [customYear, setCustomYear] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scoreRange, setScoreRange] = useState([0, 10]);
  const initSort = searchParams.get("sort");
  const [sort, setSort] = useState(
    SORTS.some((s) => s.id === initSort) ? initSort : "score",
  );
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let result = [...MOVIES];

    if (search.trim())
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          m.director.toLowerCase().includes(search.toLowerCase()) ||
          m.genreLabel.includes(search),
      );
    if (genre !== "all") result = result.filter((m) => m.genre === genre);
    const activeYear = showCustom ? customYear : year;
    if (activeYear !== "all" && activeYear !== "") {
      result = result.filter((m) => String(m.year) === String(activeYear));
    }
    result = result.filter(
      (m) => m.score >= scoreRange[0] && m.score <= scoreRange[1],
    );

    if (sort === "score") result.sort((a, b) => b.score - a.score);
    if (sort === "newest") result.sort((a, b) => b.year - a.year);
    if (sort === "reviews") result.sort((a, b) => b.reviews - a.reviews);
    if (sort === "upcoming") result.reverse();

    return result;
  }, [genre, year, customYear, showCustom, scoreRange, sort, search]);

  const handleWatchlist = (movie) => {
    if (!user) {
      onToast("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    onToast(`เพิ่ม "${movie.title}" ในรายการแล้ว`);
  };

  const resetAll = () => {
    setGenre("all");
    setYear("all");
    setCustomYear("");
    setShowCustom(false);
    setScoreRange([0, 10]);
    setSort("score");
  };
  const activeYear = showCustom ? customYear : year;
  const hasFilter =
    genre !== "all" ||
    activeYear !== "all" ||
    scoreRange[0] !== 0 ||
    scoreRange[1] !== 10;
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.inner}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <button className={styles.crumbLink} onClick={() => navigate("/")}>
              หน้าแรก
            </button>
            <span className={styles.crumbSep}>›</span>
            <span className={styles.crumbCurrent}>รายการหนังทั้งหมด</span>
          </div>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.headerRow}>
              <div>
                <h1 className={styles.pageTitle}>
                  <span className={styles.pageTitleBar} />
                  รายการหนังทั้งหมด
                </h1>
                <p className={styles.count}>พบ {filtered.length} เรื่อง</p>
              </div>

              {/* Search + Year Dropdown */}
              <div className={styles.controls}>
                {/* Search Bar */}
                <div className={styles.searchWrap}>
                  <span className={styles.searchIcon}>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="ค้นหาหนัง, ผู้กำกับ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      className={styles.searchClear}
                      onClick={() => setSearch("")}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Year Dropdown */}
                <div ref={yearDropdownRef} className={styles.yearWrap}>
                  <button
                    onClick={() => setYearOpen(!yearOpen)}
                    className={`${styles.yearBtn} ${
                      yearOpen || year !== "all" || showCustom
                        ? styles.yearBtnOn
                        : ""
                    } ${
                      year !== "all" || showCustom ? styles.yearBtnSelected : ""
                    }`}
                  >
                    <span>
                      {showCustom && customYear
                        ? customYear
                        : year !== "all"
                          ? year
                          : "ทุกปี"}
                    </span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d={yearOpen ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
                    </svg>
                  </button>

                  {yearOpen && (
                    <div className={styles.yearMenu}>
                      {/* ทุกปี */}
                      <button
                        className={`${styles.yearOption} ${
                          year === "all" && !showCustom
                            ? styles.yearOptionActive
                            : ""
                        }`}
                        onClick={() => {
                          setYear("all");
                          setShowCustom(false);
                          setCustomYear("");
                          setYearOpen(false);
                        }}
                      >
                        ทุกปี
                      </button>

                      {/* 10 ปีย้อนหลัง */}
                      {Array.from(
                        { length: 10 },
                        (_, i) => new Date().getFullYear() - i,
                      ).map((y) => (
                        <button
                          key={y}
                          className={`${styles.yearOption} ${
                            year === String(y) && !showCustom
                              ? styles.yearOptionActive
                              : ""
                          }`}
                          onClick={() => {
                            setYear(String(y));
                            setShowCustom(false);
                            setCustomYear("");
                            setYearOpen(false);
                          }}
                        >
                          {y}
                        </button>
                      ))}

                      {/* เส้นคั่น */}
                      <div className={styles.yearDivider} />

                      {/* กรอกปีเอง */}
                      <div className={styles.customWrap}>
                        <div className={styles.customLabel}>กรอกปีเอง</div>
                        <div className={styles.customRow}>
                          <input
                            type="number"
                            placeholder="เช่น 2015"
                            value={customYear}
                            className={`${styles.customInput} ${
                              showCustom && customYear
                                ? styles.customInputFilled
                                : ""
                            }`}
                            onChange={(e) => {
                              setCustomYear(e.target.value);
                              setShowCustom(true);
                              setYear("all");
                            }}
                          />
                          <button
                            className={`${styles.okBtn} ${
                              customYear ? styles.okBtnReady : ""
                            }`}
                            onClick={() => {
                              if (customYear) {
                                setShowCustom(true);
                                setYearOpen(false);
                              }
                            }}
                          >
                            ตกลง
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Layout */}
          <div className={styles.layout}>
            {/* ── Sidebar ── */}
            <div className={styles.sidebar}>
              {/* Reset */}
              {hasFilter && (
                <button className={styles.resetAll} onClick={resetAll}>
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

              {/* ช่วงคะแนน */}
              <SidebarSection title="คะแนน">
                <div className={styles.scoreBox}>
                  {/* แสดงค่าปัจจุบัน */}
                  <div className={styles.scoreValues}>
                    <span className={styles.scoreChip}>
                      ★ {scoreRange[0].toFixed(1)}
                    </span>
                    <span className={styles.scoreDash}>—</span>
                    <span className={styles.scoreChip}>
                      ★ {scoreRange[1].toFixed(1)}
                    </span>
                  </div>

                  {/* Dual Slider */}
                  <DualSlider
                    min={0}
                    max={10}
                    step={0.5}
                    value={scoreRange}
                    onChange={setScoreRange}
                  />

                  {/* Label */}
                  <div className={styles.scaleRow}>
                    <span className={styles.scaleText}>0</span>
                    <span className={styles.scaleText}>10</span>
                  </div>

                  {/* Reset */}
                  {(scoreRange[0] !== 0 || scoreRange[1] !== 10) && (
                    <button
                      className={styles.scoreReset}
                      onClick={() => setScoreRange([0, 10])}
                    >
                      รีเซ็ต
                    </button>
                  )}
                </div>
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
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}>🎬</div>
                  <p className={styles.emptyText}>ไม่พบหนังที่ตรงกับตัวกรอง</p>
                  <button className={styles.emptyBtn} onClick={resetAll}>
                    ล้างตัวกรอง
                  </button>
                </div>
              ) : (
                <div className={styles.grid}>
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
