import { useState } from "react";
import Icon from "./Icon";
import styles from "../css/components/Poster.module.css";

// โปสเตอร์หนัง: ถ้ารูปโหลดไม่ได้ จะแสดงชื่อเรื่องบนพื้นเทาแทนไอคอนรูปเสีย
export default function Poster({ src, title, alt = title, imgClassName }) {
  // จำว่า src ไหนเสีย (ไม่ใช่แค่ true/false) เพื่อให้รีเซ็ตเองเมื่อเปลี่ยนเรื่อง
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return (
      <span className={styles.fallback} role="img" aria-label={alt}>
        <Icon name="film" size={26} />
        <span>{title}</span>
      </span>
    );
  }

  return (
    <img
      className={imgClassName}
      src={src}
      alt={alt}
      onError={() => setFailedSrc(src)}
    />
  );
}
