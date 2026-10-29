import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import Icon from "./Icon";
import styles from "../css/components/MobileMenu.module.css";

const ACCOUNT_LINKS = [
  { label: "โปรไฟล์ของฉัน", path: "/profile", icon: "user" },
  { label: "รายการอยากดู", path: "/watchlist", icon: "bookmark" },
  { label: "ตั้งค่า", path: "/settings/profile", icon: "settings" },
];

// เมนูแบบ drawer สำหรับจอเล็ก (≤1000px)
export default function MobileMenu({
  open,
  onClose,
  navItems,
  pathname,
  profile,
  isAdmin = false,
  onLogin,
  onRegister,
  onLogout,
}) {
  const navigate = useNavigate();
  const panelRef = useRef(null);

  // ล็อกการเลื่อนหน้า + ปิดด้วย Esc ขณะเปิดเมนู
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const go = (path) => {
    onClose();
    navigate(path);
  };

  const fullName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : "";

  return (
    <div
      className={`${styles.overlay} ${open ? styles.open : ""}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-hidden={!open}
    >
      <aside
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="เมนู"
        tabIndex={-1}
        inert={!open}
      >
        <div className={styles.top}>
          <span className={styles.title}>เมนู</span>
          <button className={styles.close} onClick={onClose} aria-label="ปิดเมนู">
            <Icon name="close" size={20} />
          </button>
        </div>

        {profile && (
          <button className={styles.account} onClick={() => go("/profile")}>
            <Avatar src={profile.avatar} size={44} />
            <span className={styles.accountText}>
              <strong>{fullName || profile.username}</strong>
              <span>@{profile.username}</span>
            </span>
          </button>
        )}

        <nav className={styles.section}>
          <button
            className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
            onClick={() => go("/")}
          >
            หน้าแรก
          </button>
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`${styles.link} ${pathname === item.path ? styles.active : ""}`}
              onClick={() => go(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {profile ? (
          <>
            <div className={styles.section}>
              {isAdmin && (
                <button className={`${styles.link} ${styles.admin}`} onClick={() => go("/admin")}>
                  <Icon name="shield" size={18} />
                  แผงผู้ดูแลระบบ
                </button>
              )}
              {ACCOUNT_LINKS.map((l) => (
                <button
                  key={l.path}
                  className={`${styles.link} ${
                    pathname.startsWith(l.path.split("/").slice(0, 2).join("/"))
                      ? styles.active
                      : ""
                  }`}
                  onClick={() => go(l.path)}
                >
                  <Icon name={l.icon} size={18} />
                  {l.label}
                </button>
              ))}
            </div>
            <div className={styles.bottom}>
              <button
                className={styles.logout}
                onClick={() => {
                  onClose();
                  onLogout();
                }}
              >
                <Icon name="logout" size={18} />
                ออกจากระบบ
              </button>
            </div>
          </>
        ) : (
          <div className={styles.bottom}>
            <button
              className={styles.btnRegister}
              onClick={() => {
                onClose();
                onRegister();
              }}
            >
              สมัครสมาชิกฟรี
            </button>
            <button
              className={styles.btnLogin}
              onClick={() => {
                onClose();
                onLogin();
              }}
            >
              เข้าสู่ระบบ
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
