import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAccounts } from "../../context/AccountsContext";
import { useCatalog } from "../../context/CatalogContext";
import { useProfile } from "../../context/ProfileContext";
import Avatar from "../Avatar";
import Icon from "../Icon";
import styles from "../../css/pages/admin/AdminLayout.module.css";

const TITLES = [
  { match: /^\/admin\/movies\/new/, label: "เพิ่มหนัง", parent: "หนัง" },
  { match: /^\/admin\/movies\/.+\/edit/, label: "แก้ไขหนัง", parent: "หนัง" },
  { match: /^\/admin\/movies/, label: "หนังทั้งหมด" },
  { match: /^\/admin\/users\/.+/, label: "รายละเอียดบัญชี", parent: "ผู้ใช้" },
  { match: /^\/admin\/users/, label: "บัญชีผู้ใช้" },
  { match: /^\/admin\/reviews/, label: "รีวิว" },
  { match: /^\/admin\/genres/, label: "แนวหนัง" },
  { match: /^\/admin\/activity/, label: "บันทึกกิจกรรม" },
  { match: /^\/admin\/?$/, label: "ภาพรวม" },
];

const LogoSVG = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" fill="#F5C518" opacity="0.95" />
    <rect x="4" y="5" width="16" height="10" rx="1" fill="#0A0A0A" opacity="0.6" />
    <rect x="7" y="19" width="10" height="2" rx="1" fill="#F5C518" opacity="0.4" />
    <rect x="11" y="17" width="2" height="2" fill="#F5C518" opacity="0.6" />
  </svg>
);

const TOAST_MS = 5000;

export default function AdminLayout({ onLogout }) {
  const { pathname } = useLocation();
  const { profile } = useProfile();
  const { accounts } = useAccounts();
  const { allMovies, genres } = useCatalog();
  const [navOpen, setNavOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  // ปิด drawer เมื่อเปลี่ยนหน้า (มือถือ)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setNavOpen(false);
  }

  // notify("ข้อความ", { undo, error }) — ใช้จากทุกหน้าผ่าน useOutletContext()
  const notify = useCallback((msg, { undo, error } = {}) => {
    clearTimeout(timer.current);
    setToast({ msg, undo, error, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), TOAST_MS);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  const title = TITLES.find((t) => t.match.test(pathname)) ?? TITLES.at(-1);
  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || profile.username;

  const groups = [
    {
      label: "ภาพรวม",
      items: [{ to: "/admin", label: "แดชบอร์ด", icon: "dashboard", end: true }],
    },
    {
      label: "เนื้อหา",
      items: [
        { to: "/admin/movies", label: "หนัง", icon: "film", count: allMovies.length },
        { to: "/admin/genres", label: "แนวหนัง", icon: "tag", count: genres.length },
        { to: "/admin/reviews", label: "รีวิว", icon: "message" },
      ],
    },
    {
      label: "ชุมชน",
      items: [
        { to: "/admin/users", label: "บัญชีผู้ใช้", icon: "users", count: Object.keys(accounts).length },
      ],
    },
    {
      label: "ระบบ",
      items: [{ to: "/admin/activity", label: "บันทึกกิจกรรม", icon: "history" }],
    },
  ];

  return (
    <div className={styles.shell}>
      <aside
        className={`${styles.sidebar} ${navOpen ? styles.sidebarOpen : ""}`}
        aria-label="เมนูผู้ดูแลระบบ"
      >
        <Link to="/admin" className={styles.brand}>
          <LogoSVG />
          <span className={styles.brandText}>PixelFilm</span>
          <span className={styles.brandBadge}>Admin</span>
        </Link>

        {groups.map((g) => (
          <nav key={g.label} className={styles.group}>
            <span className={styles.groupLabel}>{g.label}</span>
            {g.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navActive : ""}`}
              >
                <Icon name={item.icon} size={18} />
                {item.label}
                {item.count !== undefined && <span className={styles.navCount}>{item.count}</span>}
              </NavLink>
            ))}
          </nav>
        ))}

        <div className={styles.sideBottom}>
          <Link to="/" className={styles.navLink}>
            <Icon name="external" size={18} />
            กลับไปหน้าเว็บ
          </Link>
        </div>
      </aside>
      {navOpen && <div className={styles.backdrop} onClick={() => setNavOpen(false)} />}

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            className={styles.menuBtn}
            onClick={() => setNavOpen(true)}
            aria-label="เปิดเมนูผู้ดูแล"
            aria-expanded={navOpen}
          >
            <Icon name="menu" size={22} />
          </button>
          <span className={styles.crumb}>
            {title.parent && `${title.parent} / `}
            <strong>{title.label}</strong>
          </span>
          <div className={styles.topRight}>
            <Link to="/profile" className={styles.me} title="โปรไฟล์ของฉัน">
              <Avatar src={profile.avatar} size={32} />
              <span className={styles.meText}>
                {fullName}
                <span>ผู้ดูแลระบบ</span>
              </span>
            </Link>
            <button className={styles.logoutBtn} onClick={onLogout} aria-label="ออกจากระบบ">
              <Icon name="logout" size={16} />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </header>

        <main className={styles.content}>
          <Suspense fallback={null}>
            <Outlet context={{ notify }} />
          </Suspense>
        </main>
      </div>

      {toast && (
        <div
          key={toast.id}
          className={`${styles.toast} ${toast.error ? styles.toastError : ""}`}
          role="status"
        >
          <span>{toast.msg}</span>
          {toast.undo && (
            <button
              className={styles.toastBtn}
              onClick={() => {
                toast.undo();
                setToast(null);
              }}
            >
              เลิกทำ
            </button>
          )}
        </div>
      )}
    </div>
  );
}
