import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import Icon from "./Icon";
import styles from "../css/components/UserMenu.module.css";

export default function UserMenu({ profile, onLogout }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  // ปิดเมนูเมื่อคลิกข้างนอก หรือกด Esc
  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        ref={triggerRef}
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="เมนูบัญชีผู้ใช้"
      >
        <Avatar src={profile.avatar} size={30} />
        <span className={styles.chevron}>
          <Icon name="chevronDown" size={14} />
        </span>
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <button
            className={styles.head}
            role="menuitem"
            onClick={() => go("/profile")}
          >
            <Avatar src={profile.avatar} size={42} />
            <span className={styles.headText}>
              <span className={styles.name}>{fullName || profile.username}</span>
              <span className={styles.username}>@{profile.username}</span>
            </span>
          </button>

          <div className={styles.divider} />

          <button
            className={styles.item}
            role="menuitem"
            onClick={() => go("/profile")}
          >
            <Icon name="user" size={17} />
            โปรไฟล์ของฉัน
          </button>
          <button
            className={styles.item}
            role="menuitem"
            onClick={() => go("/watchlist")}
          >
            <Icon name="bookmark" size={17} />
            รายการอยากดู
          </button>
          <button
            className={styles.item}
            role="menuitem"
            onClick={() => go("/settings/profile")}
          >
            <Icon name="settings" size={17} />
            ตั้งค่า
          </button>

          <div className={styles.divider} />

          <button
            className={`${styles.item} ${styles.danger}`}
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <Icon name="logout" size={17} />
            ออกจากระบบ
          </button>
        </div>
      )}
    </div>
  );
}
