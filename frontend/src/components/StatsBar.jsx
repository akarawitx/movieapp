import styles from "../css/components/StatsBar.module.css";

const STATS = [
  { number: "12,840", label: "รีวิวทั้งหมด" },
  { number: "3,250", label: "หนังในฐานข้อมูล" },
  { number: "48,600", label: "สมาชิก" },
  { number: "8.4", label: "คะแนนเฉลี่ย" },
];

export default function StatsBar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        {STATS.map((s, i) => (
          <div key={s.label} className={styles.item}>
            {i < STATS.length - 1 && <div className={styles.divider} />}
            <div className={styles.number}>{s.number}</div>
            <div className={styles.label}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
