import styles from "../css/components/PasswordStrength.module.css";

const LEVELS = [
  { label: "อ่อนมาก", color: "#e50914" },
  { label: "อ่อน", color: "#ff6b35" },
  { label: "ปานกลาง", color: "#f5c518" },
  { label: "แข็งแรง", color: "#2ecc71" },
];

// 0–3: ความยาว ≥ 8, ตัวพิมพ์เล็ก+ใหญ่, ตัวเลข, สัญลักษณ์
function passwordScore(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.max(score, 1) - 1;
}

// แถบบอกความแข็งแรงของรหัสผ่าน (ไม่แสดงอะไรถ้ายังไม่ได้พิมพ์)
export default function PasswordStrength({ password }) {
  if (!password) return null;
  const level = passwordScore(password);
  const { label, color } = LEVELS[level];
  return (
    <div className={styles.wrap} aria-live="polite">
      <div className={styles.bars}>
        {LEVELS.map((l, i) => (
          <span key={l.label} style={i <= level ? { background: color } : undefined} />
        ))}
      </div>
      <p className={styles.label} style={{ color }}>
        ความแข็งแรง: {label}
      </p>
    </div>
  );
}
