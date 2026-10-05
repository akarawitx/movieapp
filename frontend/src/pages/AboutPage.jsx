import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import styles from "../css/pages/AboutPage.module.css";

const VALUES = [
  {
    icon: "star",
    title: "รีวิวที่จริงใจ",
    desc: "ทุกคะแนนและทุกความเห็นมาจากผู้ชมจริง เพื่อให้คุณตัดสินใจเลือกหนังได้อย่างมั่นใจ",
  },
  {
    icon: "users",
    title: "ชุมชนคนรักหนัง",
    desc: "พื้นที่แลกเปลี่ยนมุมมองระหว่างคอหนังทุกแนว ตั้งแต่หนังบล็อกบัสเตอร์ไปจนถึงหนังอินดี้",
  },
  {
    icon: "film",
    title: "ข้อมูลครบ เข้าถึงง่าย",
    desc: "รวมข้อมูลผู้กำกับ นักแสดง และเรื่องย่อ พร้อมตัวกรองที่ช่วยหาหนังที่ใช่ได้ในไม่กี่คลิก",
  },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <span className={styles.badge}>เกี่ยวกับเรา</span>
        <h1 className={styles.heroTitle}>
          ชุมชนคนรักหนัง
          <br />
          ที่ทุกรีวิว<span className={styles.gradientText}>มีความหมาย</span>
        </h1>
        <p className={styles.heroDesc}>
          PixelFilm คือแพลตฟอร์มรวมรีวิวและคะแนนหนัง ที่ช่วยให้คุณค้นพบหนังที่ใช่
          และแบ่งปันความรู้สึกหลังดูจบกับคนที่รักหนังเหมือนกัน
        </p>
      </section>

      <div className="container">
        {/* Mission */}
        <section className={styles.mission}>
          <h2 className={styles.missionTitle}>ภารกิจของเรา</h2>
          <p className={styles.missionText}>
            เราเชื่อว่าหนังที่ดีควรถูกพูดถึง และความเห็นของผู้ชมทุกคนมีคุณค่า
            เราจึงสร้างพื้นที่ที่ทุกคนให้คะแนน เขียนรีวิว และแสดงความคิดเห็นได้อย่างอิสระ
            พร้อมเครื่องมือที่ทำให้การค้นหาหนังเป็นเรื่องง่ายและสนุก
          </p>
        </section>

        {/* Values */}
        <section className={styles.values}>
          {VALUES.map((v) => (
            <div key={v.title} className={styles.card}>
              <div className={styles.iconBox}>
                <Icon name={v.icon} />
              </div>
              <h3 className={styles.cardTitle}>{v.title}</h3>
              <p className={styles.cardDesc}>{v.desc}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>พร้อมค้นหาหนังเรื่องต่อไปแล้วหรือยัง?</h2>
          <p className={styles.ctaDesc}>
            สำรวจรายการหนังทั้งหมด หรือส่งข้อความมาหาเราได้ทุกเมื่อ
          </p>
          <div className={styles.ctaButtons}>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => navigate("/movies")}
            >
              สำรวจรายการหนัง
            </button>
            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => navigate("/contact")}
            >
              ติดต่อเรา
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
