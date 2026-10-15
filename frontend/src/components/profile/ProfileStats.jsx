import styles from "../../css/components/profile/ProfileStats.module.css";

export default function ProfileStats({ activity }) {
  const { reviews, ratings, watchlist } = activity;
  const avg = ratings.length
    ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(1)
    : "–";

  const stats = [
    { label: "รีวิว", value: reviews.length },
    { label: "ให้คะแนน", value: ratings.length },
    { label: "อยากดู", value: watchlist.length },
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
