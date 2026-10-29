import { useLocation, useNavigate } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";
import styles from "../css/pages/NotFoundPage.module.css";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { movies } = useCatalog();
  const SUGGESTIONS = [...movies].sort((a, b) => b.score - a.score).slice(0, 4);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.code} aria-hidden="true">
          4<span className={styles.reel}>0</span>4
        </div>
        <h1 className={styles.title}>ฉากนี้ถูกตัดทิ้งไปแล้ว</h1>
        <p className={styles.desc}>
          ไม่พบหน้า <code className={styles.path}>{pathname}</code>{" "}
          ลิงก์อาจผิด หรือหน้านี้อาจถูกย้ายไปแล้ว
        </p>
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={() => navigate("/")}>
            กลับหน้าแรก
          </button>
          <button className={styles.btnGhost} onClick={() => navigate("/movies")}>
            ดูรายการหนังทั้งหมด
          </button>
        </div>
      </section>

      <section className={styles.suggest}>
        <h2 className={styles.suggestTitle}>หรือลองดูหนังคะแนนสูงเหล่านี้</h2>
        <div className={styles.grid}>
          {SUGGESTIONS.map((m) => (
            <button
              key={m.id}
              className={styles.card}
              onClick={() => navigate("/movies?sort=score")}
            >
              <div className={styles.poster}>
                <img src={m.poster} alt={m.title} />
                <span className={styles.score}>★ {m.score}</span>
              </div>
              <span className={styles.cardTitle}>{m.title}</span>
              <span className={styles.cardMeta}>
                {m.year} · {m.genreLabel}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
