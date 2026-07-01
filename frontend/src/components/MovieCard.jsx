export default function MovieCard({ movie, onOpen, onWatchlist }) {
  return (
    <div
      onClick={() => onOpen(movie)}
      style={{
        background: "#161616",
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.borderColor = "rgba(245,197,24,0.3)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.6)";
        e.currentTarget.querySelector(".overlay").style.opacity = "1";
        e.currentTarget.querySelector(".actions").style.opacity = "1";
        e.currentTarget.querySelector(".actions").style.transform =
          "translateY(0)";
        e.currentTarget.querySelector(".poster-img").style.transform =
          "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.querySelector(".overlay").style.opacity = "0";
        e.currentTarget.querySelector(".actions").style.opacity = "0";
        e.currentTarget.querySelector(".actions").style.transform =
          "translateY(8px)";
        e.currentTarget.querySelector(".poster-img").style.transform = "none";
      }}
    >
      {/* Poster */}
      <div
        style={{
          aspectRatio: "2/3",
          position: "relative",
          overflow: "hidden",
          minHeight: "200px", // ← ป้องกันการ์ดยุบก่อนรูปโหลด
          background: "#1a1a1a", // ← สีพื้นหลังระหว่างโหลด
        }}
      >
        <img
          className="poster-img"
          src={movie.poster}
          alt={movie.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            display: "block",
          }}
          onError={(e) => {
            e.target.style.display = "none"; // ซ่อนรูปที่โหลดไม่ได้
          }}
        />
        <div
          className="overlay"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%)",
            opacity: 0,
            transition: "opacity 0.3s",
          }}
        />

        {/* Score Badge */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(245,197,24,0.4)",
            borderRadius: "8px",
            padding: "4px 8px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span
            style={{
              color: "#F5C518",
              fontWeight: 700,
              fontSize: "13px",
              fontFamily: "'Prompt', sans-serif",
            }}
          >
            ★ {movie.score}
          </span>
        </div>

        {/* Quick Actions */}
        <div
          className="actions"
          style={{
            position: "absolute",
            bottom: "12px",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            opacity: 0,
            transform: "translateY(8px)",
            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatchlist(movie);
            }}
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Prompt', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F5C518";
              e.currentTarget.style.color = "#000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              e.currentTarget.style.color = "white";
            }}
          >
            +
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(movie);
            }}
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Prompt', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F5C518";
              e.currentTarget.style.color = "#000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              e.currentTarget.style.color = "white";
            }}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px" }}>
        <div
          style={{
            fontFamily: "'Prompt', sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            marginBottom: "4px",
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "#fff",
          }}
        >
          {movie.title}
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              background: "rgba(245,197,24,0.1)",
              color: "rgba(245,197,24,0.85)",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: 600,
              fontFamily: "'Prompt', sans-serif",
            }}
          >
            {movie.genreLabel}
          </span>
          <span
            style={{
              fontSize: "12px",
              color: "#888",
              fontFamily: "'Prompt', sans-serif",
            }}
          >
            {movie.year}
          </span>
        </div>
        <div
          style={{
            marginTop: "6px",
            fontSize: "11px",
            color: "#555",
            fontFamily: "'Prompt', sans-serif",
          }}
        >
          {movie.reviews.toLocaleString()} รีวิว
        </div>
      </div>
    </div>
  );
}
