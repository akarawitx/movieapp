import styles from "../css/components/Avatar.module.css";

// รูปตั้งต้น: วางไฟล์ไว้ที่ src/assets/default-avatar.png (หรือ .jpg/.webp/.svg)
// ถ้ายังไม่มีไฟล์ จะใช้ไอคอนรูปคนสีเทาแทน
const defaults = import.meta.glob(
  "../assets/default-avatar.{png,jpg,jpeg,webp,svg}",
  { eager: true, import: "default" }
);
const DEFAULT_AVATAR = Object.values(defaults)[0];

// ส่ง color + name มาด้วย (เช่น นักรีวิวที่ไม่มีรูป) จะแสดงอักษรย่อบนพื้นสีแทนรูปตั้งต้น
export default function Avatar({
  src,
  size = 34,
  alt = "รูปโปรไฟล์",
  className = "",
  name,
  color,
}) {
  const image = src || DEFAULT_AVATAR;
  if (!src && color && name) {
    return (
      <span
        className={`${styles.avatar} ${styles.initials} ${className}`}
        style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}
        role="img"
        aria-label={alt}
      >
        {name.slice(0, 2)}
      </span>
    );
  }
  return (
    <span
      className={`${styles.avatar} ${className}`}
      style={{ width: size, height: size }}
    >
      {image ? (
        <img className={styles.img} src={image} alt={alt} />
      ) : (
        <svg
          className={styles.fallback}
          viewBox="0 0 24 24"
          role="img"
          aria-label={alt}
        >
          <circle cx="12" cy="9" r="4.2" />
          <path d="M3.5 21.5c.9-4.3 4.3-6.8 8.5-6.8s7.6 2.5 8.5 6.8z" />
        </svg>
      )}
    </span>
  );
}
