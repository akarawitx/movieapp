import { Link } from "react-router-dom";
import styles from "../css/components/Footer.module.css";

const LogoSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect
      x="2"
      y="3"
      width="20"
      height="14"
      rx="2"
      fill="#F5C518"
      opacity="0.95"
    />
    <rect
      x="4"
      y="5"
      width="16"
      height="10"
      rx="1"
      fill="#0A0A0A"
      opacity="0.6"
    />
    <rect
      x="7"
      y="19"
      width="10"
      height="2"
      rx="1"
      fill="#F5C518"
      opacity="0.4"
    />
    <rect x="11" y="17" width="2" height="2" fill="#F5C518" opacity="0.6" />
  </svg>
);

export default function Footer() {
  const cols = [
    {
      title: "หมวดหมู่",
      links: [
        { label: "แอ็คชั่น", to: "/movies?genre=action" },
        { label: "ดราม่า", to: "/movies?genre=drama" },
        { label: "ตลก", to: "/movies?genre=comedy" },
        { label: "สยองขวัญ", to: "/movies?genre=horror" },
        { label: "หนังไทย" },
      ],
    },
    {
      title: "บริการ",
      links: [
        { label: "รีวิวหนัง" },
        { label: "Top Charts", to: "/charts" },
        { label: "ปฏิทินฉาย", to: "/calendar" },
        { label: "รายการอยากดู", to: "/watchlist" },
      ],
    },
    {
      title: "เกี่ยวกับ",
      links: [
        { label: "เกี่ยวกับเรา", to: "/about" },
        { label: "ติดต่อเรา", to: "/contact" },
        { label: "นโยบายความเป็นส่วนตัว" },
        { label: "เงื่อนไขการใช้งาน" },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logoRow}>
            <LogoSVG />
            <span className={styles.logoText}>PixelFilm</span>
          </div>
          <p className={styles.desc}>
            แพลตฟอร์มรีวิวหนังและซีรีส์ที่ใหญ่ที่สุดในไทย รีวิวโดยคนไทย
            สำหรับคนไทย ค้นพบหนังดีๆ อ่านรีวิวจริงจากผู้ชมทั่วประเทศ
          </p>
        </div>

        {/* Cols */}
        {cols.map((col) => (
          <div key={col.title}>
            <div className={styles.colTitle}>{col.title}</div>
            <ul className={styles.list}>
              {/* ลิงก์ที่ยังไม่มีหน้า (ไม่มี to) ยังคงเป็น # ไว้ก่อน */}
              {col.links.map((link) => (
                <li key={link.label} className={styles.listItem}>
                  {link.to ? (
                    <Link to={link.to} className={styles.link}>
                      {link.label}
                    </Link>
                  ) : (
                    <a href="#" className={styles.link}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <span className={styles.copy}>
          © 2024 PixelFilm Thailand. สงวนลิขสิทธิ์ทุกประการ
        </span>
        <span className={styles.copy}>สร้างด้วยความรักสำหรับคนรักหนัง</span>
      </div>
    </footer>
  );
}
