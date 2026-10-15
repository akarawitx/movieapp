import { Link } from "react-router-dom";
import { LEGAL_UPDATED } from "../data/legal";
import Icon from "./Icon";
import styles from "../css/components/LegalDocument.module.css";

const scrollToId = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

// เค้าโครงหน้าเอกสาร (นโยบาย / เงื่อนไข): สารบัญด้านข้าง + หัวข้อมีเลขกำกับ
export default function LegalDocument({ doc, related }) {
  const updated = new Date(LEGAL_UPDATED).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.container}>
          <nav className={styles.crumbs} aria-label="breadcrumb">
            <Link to="/">หน้าแรก</Link>
            <span>/</span>
            <span className={styles.crumbCurrent}>{doc.title}</span>
          </nav>
          <h1 className={styles.title}>{doc.title}</h1>
          <p className={styles.updated}>
            <Icon name="calendar" size={14} />
            ปรับปรุงล่าสุด {updated}
          </p>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.layout}>
          <aside className={styles.toc}>
            <p className={styles.tocTitle}>สารบัญ</p>
            <ol>
              {doc.sections.map((s, i) => (
                <li key={s.id}>
                  <button onClick={() => scrollToId(s.id)}>
                    <span>{i + 1}.</span> {s.title}
                  </button>
                </li>
              ))}
            </ol>
            {related && (
              <Link to={related.to} className={styles.related}>
                {related.label} →
              </Link>
            )}
          </aside>

          <article className={styles.doc}>
            <div className={styles.notice} role="note">
              <Icon name="alert" size={18} />
              <span>
                เอกสารนี้เป็นตัวอย่างสำหรับโปรเจกต์สาธิต ไม่ใช่ข้อตกลงทางกฎหมายที่มีผลบังคับใช้จริง
              </span>
            </div>

            <p className={styles.intro}>{doc.intro}</p>

            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} className={styles.section}>
                <h2>
                  <span className={styles.num}>{i + 1}</span>
                  {s.title}
                </h2>
                {s.paragraphs?.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {s.list && (
                  <ul>
                    {s.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <div className={styles.contact}>
              <strong>มีคำถามเกี่ยวกับเอกสารนี้?</strong>
              <p>ติดต่อทีมงาน PixelFilm ได้ทุกวัน เราจะตอบกลับโดยเร็วที่สุด</p>
              <Link to="/contact" className={styles.contactBtn}>
                ติดต่อเรา
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
