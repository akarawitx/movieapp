export default function HeroBanner({ movie, onOpen, onWatchlist }) {
  if (!movie) return null;
  return (
    <div
      style={{
        marginTop: "60px",
        height: "600px",
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        padding: "0 5% 60px",
        overflow: "hidden",
      }}
    >
      {/* BG */}
      <div style={{ position: "absolute", inset: 0 }}>
        {/* ← รูปพื้นหลังชัดขึ้น opacity 0.2 → 1 */}
        <img
          src={movie.backdrop}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 1, // ← เปลี่ยนจาก 0.2 เป็น 1
          }}
        />
        {/* ← Gradient ซ้าย: เข้มขึ้นเพื่อให้ข้อความอ่านได้ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
            linear-gradient(to right,
              rgba(0,0,0,0.85) 0%,
              rgba(0,0,0,0.6) 40%,
              rgba(0,0,0,0.1) 70%,
              transparent 100%
            ),
            linear-gradient(to top,
              rgba(0,0,0,0.9) 0%,
              rgba(0,0,0,0.4) 30%,
              transparent 60%
            )
          `,
          }}
        />
      </div>

      {/* Content — เหมือนเดิมทุกอย่าง */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: "600px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(229,9,20,0.2)",
            border: "1px solid rgba(229,9,20,0.4)",
            color: "#FF6B6B",
            fontSize: "12px",
            fontWeight: 600,
            padding: "4px 12px",
            borderRadius: "20px",
            marginBottom: "16px",
            fontFamily: "'Prompt', sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          แนะนำประจำสัปดาห์
        </div>

        <h1
          style={{
            fontFamily: "'Prompt', sans-serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: "12px",
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            color: "#fff",
          }}
        >
          {movie.title}
        </h1>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(245,197,24,0.15)",
              border: "1px solid rgba(245,197,24,0.3)",
              padding: "4px 12px",
              borderRadius: "20px",
            }}
          >
            <span
              style={{
                color: "#F5C518",
                fontWeight: 700,
                fontSize: "15px",
                fontFamily: "'Prompt', sans-serif",
              }}
            >
              ★ {movie.score}
            </span>
            <span
              style={{
                color: "#888",
                fontSize: "12px",
                fontFamily: "'Prompt', sans-serif",
              }}
            >
              / 10
            </span>
          </div>
          {[movie.year, movie.duration, movie.genreLabel].map((t) => (
            <span
              key={t}
              style={{
                background: "rgba(255,255,255,0.08)",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                color: "#aaa",
                fontFamily: "'Prompt', sans-serif",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <p
          style={{
            color: "#ccc",
            fontSize: "15px",
            lineHeight: 1.7,
            marginBottom: "28px",
            maxWidth: "480px",
            fontFamily: "'Prompt', sans-serif",
          }}
        >
          {movie.synopsis}
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => onOpen(movie)}
            style={{
              background: "#E50914",
              color: "white",
              border: "none",
              fontSize: "15px",
              fontWeight: 700,
              padding: "12px 28px",
              borderRadius: "10px",
              cursor: "pointer",
              fontFamily: "'Prompt', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#b0060f";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#E50914";
              e.currentTarget.style.transform = "none";
            }}
          >
            ▶ ดูรีวิว
          </button>

          <button
            onClick={() => onWatchlist(movie)}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              fontSize: "15px",
              fontWeight: 600,
              padding: "12px 28px",
              borderRadius: "10px",
              cursor: "pointer",
              fontFamily: "'Prompt', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backdropFilter: "blur(10px)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.18)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.transform = "none";
            }}
          >
            + เพิ่มในรายการ
          </button>
        </div>
      </div>
    </div>
  );
}
