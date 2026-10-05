import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../css/components/Header.module.css";

const NAV_ITEMS = [
  { label: "รายการหนังทั้งหมด", path: "/movies" },
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

function Field({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      <input
        className={styles.fieldInput}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default function Header({ user, onLogin }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [regForm, setRegForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [currentUser, setCurrentUser] = useState(user || null);

  const handleLogin = () => {
    if (!loginForm.username || !loginForm.password) return;
    setCurrentUser(loginForm.username);
    onLogin?.(loginForm.username);
    setLoginOpen(false);
    setLoginForm({ username: "", password: "" });
  };

  const handleRegister = () => {
    if (!regForm.username || !regForm.email || !regForm.password) return;
    setCurrentUser(regForm.username);
    onLogin?.(regForm.username);
    setRegisterOpen(false);
    setRegForm({ username: "", email: "", password: "" });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    onLogin?.(null);
    setProfileOpen(false);
  };

  const initials = currentUser?.substring(0, 2).toUpperCase() || "U";

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

        {/* Auth */}
        <div className={styles.auth}>
          {!currentUser ? (
            <>
              <button
                className={styles.btnLogin}
                onClick={() => setLoginOpen(true)}
              >
                เข้าสู่ระบบ
              </button>
              <button
                className={styles.btnRegister}
                onClick={() => setRegisterOpen(true)}
              >
                สมัครสมาชิก
              </button>
            </>
          ) : (
            <button
              className={styles.avatar}
              onClick={() => setProfileOpen(true)}
            >
              {initials}
            </button>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      <Modal isOpen={loginOpen} onClose={() => setLoginOpen(false)}>
        {modalLogo("เข้าสู่ระบบเพื่อรีวิวหนังและบันทึกรายการโปรด")}
        <Field
          label="ชื่อผู้ใช้"
          placeholder="กรอกชื่อผู้ใช้"
          value={loginForm.username}
          onChange={(e) =>
            setLoginForm({ ...loginForm, username: e.target.value })
          }
        />
        <Field
          label="รหัสผ่าน"
          type="password"
          placeholder="กรอกรหัสผ่าน"
          value={loginForm.password}
          onChange={(e) =>
            setLoginForm({ ...loginForm, password: e.target.value })
          }
        />
        <button className={styles.submitBtn} onClick={handleLogin}>
          เข้าสู่ระบบ
        </button>
        <p className={styles.switchText}>
          ยังไม่มีบัญชี?{" "}
          <span
            className={styles.switchLink}
            onClick={() => {
              setLoginOpen(false);
              setRegisterOpen(true);
            }}
          >
            สมัครสมาชิกฟรี
          </span>
        </p>
      </Modal>

      {/* Register Modal */}
      <Modal isOpen={registerOpen} onClose={() => setRegisterOpen(false)}>
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
        />
        <button className={styles.submitBtn} onClick={handleRegister}>
          สมัครสมาชิกฟรี
        </button>
        <p className={styles.switchText}>
          มีบัญชีแล้ว?{" "}
          <span
            className={styles.switchLink}
            onClick={() => {
              setRegisterOpen(false);
              setLoginOpen(true);
            }}
          >
            เข้าสู่ระบบ
          </span>
        </p>
      </Modal>

      {/* Profile Modal */}
      <Modal isOpen={profileOpen} onClose={() => setProfileOpen(false)}>
        <div className={styles.profileHead}>
          <div className={styles.profileAvatar}>{initials}</div>
          <div className={styles.profileName}>{currentUser}</div>
          <div className={styles.profileRole}>สมาชิก PixelFilm</div>
        </div>
        <div className={styles.statsGrid}>
          {[
            { label: "รีวิว", value: "0" },
            { label: "รายการ", value: "0" },
            { label: "Likes", value: "0" },
          ].map((s) => (
            <div key={s.label} className={styles.statBox}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          ออกจากระบบ
        </button>
      </Modal>
    </>
  );
}
