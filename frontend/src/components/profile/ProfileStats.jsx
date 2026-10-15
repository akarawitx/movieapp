import styles from "../../css/components/profile/ProfileStats.module.css";

// likes: ถ้าส่งมา (โปรไฟล์สาธารณะ) จะแสดง "ถูกใจที่ได้รับ" แทนจำนวนรายการอยากดู
export default function ProfileStats({ activity, likes }) {
  const { reviews, ratings, watchlist } = activity;
  const avg = ratings.length
    ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(1)
    : "–";

  const stats = [
    { label: "รีวิว", value: reviews.length },
    { label: "ให้คะแนน", value: ratings.length },
    likes == null
      ? { label: "อยากดู", value: watchlist.length }
      : { label: "ถูกใจที่ได้รับ", value: likes.toLocaleString() },
    { label: "คะแนนเฉลี่ยที่ให้", value: avg },
  ];

  return (
    <div className={styles.grid}>
      {stats.map((s) => (
        <div key={s.label} className={styles.box}>
          <div className={styles.value}>{s.value}</div>
          <div className={styles.label}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
