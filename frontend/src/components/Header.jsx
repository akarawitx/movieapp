import { useCallback, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";
import SearchBox from "./SearchBox";
import MobileMenu from "./MobileMenu";
import Icon from "./Icon";
import { useProfile } from "../context/ProfileContext";
import { useAccounts } from "../context/AccountsContext";
import styles from "../css/components/Header.module.css";

const PROTECTED_PATHS = ["/profile", "/settings", "/watchlist", "/admin"];

const NAV_ITEMS = [
  { label: "รายการหนังทั้งหมด", path: "/movies" },
  { label: "Top Charts", path: "/charts" },
  { label: "เกี่ยวกับเรา", path: "/about" },
  { label: "ติดต่อเรา", path: "/contact" },
];

const LogoSVG = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect
      x="2"
      y="3"
      width="20"
      height="14"
      rx="2"
      fill="#F5C518"
      opacity="0.95"
    />
    <rect
      x="4"
      y="5"
      width="16"
      height="10"
      rx="1"
      fill="#0A0A0A"
      opacity="0.6"
    />
    <rect
      x="7"
      y="19"
      width="10"
      height="2"
      rx="1"
      fill="#F5C518"
      opacity="0.4"
    />
    <rect x="11" y="17" width="2" height="2" fill="#F5C518" opacity="0.6" />
  </svg>
);

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modalBox}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

function Field({ label, type = "text", placeholder, value, onChange, autoComplete }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      <input
        className={styles.fieldInput}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />
    </div>
  );
}

export default function Header({ user, onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { profile } = useProfile();
  const { login, register, isAdmin } = useAccounts();
  const [authError, setAuthError] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [regForm, setRegForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // ถูกพามาจากหน้าที่ต้องล็อกอิน (ProtectedRoute) → เปิดหน้าต่าง Login ให้อัตโนมัติ
  const loginRedirect = location.state?.requireLogin ? location.state : null;
  const [handledKey, setHandledKey] = useState(null);
  if (loginRedirect && !user && handledKey !== location.key) {
    setHandledKey(location.key);
    setLoginOpen(true);
  }

  const clearLoginRedirect = () => {
    if (loginRedirect) navigate(pathname, { replace: true, state: null });
  };

  // ผู้ดูแลระบบ → ไปหน้าจัดการ (ยกเว้นถูกพามาจากหน้าที่ต้องล็อกอิน ให้กลับไปหน้านั้น)
  const completeAuth = (account) => {
    if (loginRedirect?.from) navigate(loginRedirect.from, { replace: true });
    else if (account.role === "admin") navigate("/admin");
  };

  const closeAuth = () => {
    setAuthError("");
    setLoginOpen(false);
    setRegisterOpen(false);
  };

  const openLogin = () => {
    setAuthError("");
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const openRegister = () => {
    setAuthError("");
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const handleLogin = (e) => {
    e?.preventDefault();
    const { account, error } = login(loginForm.username, loginForm.password);
    if (error) return setAuthError(error);
    completeAuth(account);
    closeAuth();
    setLoginForm({ username: "", password: "" });
  };

  const handleRegister = (e) => {
    e?.preventDefault();
    const { account, error } = register(regForm);
    if (error) return setAuthError(error);
    completeAuth(account);
    closeAuth();
    setRegForm({ username: "", email: "", password: "" });
  };

  // ปิดหน้าต่าง Login/สมัคร แล้วไปหน้าอื่น (ลืมรหัสผ่าน, เงื่อนไข, นโยบาย)
  const leaveModalTo = (path) => {
    closeAuth();
    navigate(path);
  };

  const handleLogout = () => {
    // หน้าที่ต้องล็อกอิน → ให้ App ล้างผู้ใช้หลังจากไปถึงหน้าแรกแล้ว
    if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) navigate("/", { state: { logout: true } });
    else onLogin?.(null);
  };

  const modalLogo = (sub) => (
    <div className={styles.modalLogo}>
      <div className={styles.modalLogoRow}>
        <LogoSVG />
        <span className={styles.modalLogoText}>PixelFilm</span>
      </div>
      <p className={styles.modalSub}>{sub}</p>
    </div>
  );

  return (
    <>
      <nav className={styles.nav}>
        {/* Logo */}
        <div className={styles.logo} onClick={() => navigate("/")}>
          <LogoSVG />
          <span className={styles.logoText}>PixelFilm</span>
        </div>

        {/* Nav Links */}
        <div className={styles.links}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`${styles.navBtn} ${
                pathname === item.path ? styles.navBtnActive : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search (desktop) — key ทำให้คำค้นตรงกับ URL เมื่ออยู่หน้า /search */}
        <div className={styles.search}>
          <SearchBox key={pathname === "/search" ? location.search : "search"} />
        </div>

        {/* Auth */}
        <div className={styles.auth}>
          <button
            className={styles.iconBtn}
            onClick={() => setSearchOpen((o) => !o)}
            aria-label="ค้นหา"
            aria-expanded={searchOpen}
          >
            <Icon name={searchOpen ? "close" : "search"} size={20} />
          </button>
          {!user || !profile ? (
            <>
              <button className={styles.btnLogin} onClick={openLogin}>
                เข้าสู่ระบบ
              </button>
              <button className={styles.btnRegister} onClick={openRegister}>
                สมัครสมาชิก
              </button>
            </>
          ) : (
            <UserMenu profile={profile} isAdmin={isAdmin} onLogout={handleLogout} />
          )}
          <button
            className={`${styles.iconBtn} ${styles.menuBtn}`}
            onClick={() => setMenuOpen(true)}
            aria-label="เปิดเมนู"
            aria-expanded={menuOpen}
          >
            <Icon name="menu" size={22} />
          </button>
        </div>
      </nav>

      {/* Search (mobile) */}
      {searchOpen && (
        <div className={styles.mobileSearch}>
          <SearchBox
            key={pathname === "/search" ? location.search : "search"}
            autoFocus
            onDone={() => setSearchOpen(false)}
          />
        </div>
      )}

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        navItems={NAV_ITEMS}
        pathname={pathname}
        profile={user ? profile : null}
        isAdmin={isAdmin}
        onLogin={openLogin}
        onRegister={openRegister}
        onLogout={handleLogout}
      />

      {/* Login Modal */}
      <Modal
        isOpen={loginOpen}
        onClose={() => {
          closeAuth();
          clearLoginRedirect();
        }}
      >
        {modalLogo(
          loginRedirect
            ? loginRedirect.message || "กรุณาเข้าสู่ระบบก่อนเข้าใช้งานหน้านี้"
            : "เข้าสู่ระบบเพื่อรีวิวหนังและบันทึกรายการโปรด"
        )}
        <Field
          label="ชื่อผู้ใช้"
          placeholder="กรอกชื่อผู้ใช้"
          value={loginForm.username}
          onChange={(e) =>
            setLoginForm({ ...loginForm, username: e.target.value })
          }
          autoComplete="username"
        />
        <Field
          label="รหัสผ่าน"
          type="password"
          placeholder="กรอกรหัสผ่าน"
          value={loginForm.password}
          onChange={(e) =>
            setLoginForm({ ...loginForm, password: e.target.value })
          }
          autoComplete="current-password"
        />
        <div className={styles.forgotRow}>
          <button
            type="button"
            className={styles.forgotLink}
            onClick={() => leaveModalTo("/forgot-password")}
          >
            ลืมรหัสผ่าน?
          </button>
        </div>
        {authError && (
          <p className={styles.authError} role="alert">
            {authError}
          </p>
        )}
        <button className={styles.submitBtn} onClick={handleLogin}>
          เข้าสู่ระบบ
        </button>
        <p className={styles.switchText}>
          ยังไม่มีบัญชี?{" "}
          <span className={styles.switchLink} onClick={openRegister}>
            สมัครสมาชิกฟรี
          </span>
        </p>
      </Modal>

      {/* Register Modal */}
      <Modal isOpen={registerOpen} onClose={closeAuth}>
        {modalLogo("สร้างบัญชีเพื่อเริ่มรีวิวหนัง")}
        <Field
          label="ชื่อผู้ใช้"
          placeholder="กรอกชื่อผู้ใช้"
          value={regForm.username}
          onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
        />
        <Field
          label="อีเมล"
          type="email"
          placeholder="your@email.com"
          value={regForm.email}
          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
        />
        <Field
          label="รหัสผ่าน"
          type="password"
          placeholder="อย่างน้อย 6 ตัวอักษร"
          value={regForm.password}
          onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
          autoComplete="new-password"
        />
        {authError && (
          <p className={styles.authError} role="alert">
            {authError}
          </p>
        )}
        <button className={styles.submitBtn} onClick={handleRegister}>
          สมัครสมาชิกฟรี
        </button>
        <p className={styles.consent}>
          การสมัครสมาชิกถือว่าคุณยอมรับ{" "}
          <button type="button" onClick={() => leaveModalTo("/terms")}>
            เงื่อนไขการใช้งาน
          </button>{" "}
          และ{" "}
          <button type="button" onClick={() => leaveModalTo("/privacy")}>
            นโยบายความเป็นส่วนตัว
          </button>
        </p>
        <p className={styles.switchText}>
          มีบัญชีแล้ว?{" "}
          <span className={styles.switchLink} onClick={openLogin}>
            เข้าสู่ระบบ
          </span>
        </p>
      </Modal>

    </>
  );
}
