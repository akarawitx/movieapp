import styles from "../css/components/Avatar.module.css";

// รูปตั้งต้น: วางไฟล์ไว้ที่ src/assets/default-avatar.png (หรือ .jpg/.webp/.svg)
// ถ้ายังไม่มีไฟล์ จะใช้ไอคอนรูปคนสีเทาแทน
const defaults = import.meta.glob(
  "../assets/default-avatar.{png,jpg,jpeg,webp,svg}",
  { eager: true, import: "default" }
);
const DEFAULT_AVATAR = Object.values(defaults)[0];

export default function Avatar({ src, size = 34, alt = "รูปโปรไฟล์", className = "" }) {
  const image = src || DEFAULT_AVATAR;
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
