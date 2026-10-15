import { Navigate, NavLink, useParams } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import Icon from "../components/Icon";
import PersonalInfoForm from "../components/settings/PersonalInfoForm";
import AvatarSettings from "../components/settings/AvatarSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import PreferencesSettings from "../components/settings/PreferencesSettings";
import DangerZone from "../components/settings/DangerZone";
import styles from "../css/pages/SettingsPage.module.css";

const SECTIONS = [
  { id: "profile", label: "ข้อมูลส่วนตัว", icon: "user", Component: PersonalInfoForm },
  { id: "avatar", label: "รูปโปรไฟล์", icon: "camera", Component: AvatarSettings },
  { id: "security", label: "บัญชีและความปลอดภัย", icon: "lock", Component: SecuritySettings },
  { id: "preferences", label: "ความชอบและความเป็นส่วนตัว", icon: "sliders", Component: PreferencesSettings },
  { id: "danger", label: "ลบบัญชี", icon: "trash", Component: DangerZone, danger: true },
];

export default function SettingsPage({ onToast }) {
  const { section } = useParams();
  const { profile } = useProfile();
  const current = SECTIONS.find((s) => s.id === section);

  if (!current) return <Navigate to="/settings/profile" replace />;

  const { Component } = current;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>ตั้งค่า</h1>
          <NavLink to="/profile" className={styles.backLink}>
            ดูโปรไฟล์ @{profile.username} →
          </NavLink>
        </header>

        <div className={styles.layout}>
          <nav className={styles.sidebar} aria-label="หมวดการตั้งค่า">
            {SECTIONS.map((s) => (
              <NavLink
                key={s.id}
                to={`/settings/${s.id}`}
                className={({ isActive }) =>
                  [
                    styles.navItem,
                    isActive ? styles.navActive : "",
                    s.danger ? styles.navDanger : "",
                  ].join(" ")
                }
              >
                <Icon name={s.icon} size={17} />
                {s.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.content}>
            {/* key ทำให้ฟอร์มรีเซ็ตเมื่อสลับหมวดหรือเปลี่ยน username */}
            <Component key={`${current.id}-${profile.username}`} onToast={onToast} />
          </div>
        </div>
      </div>
    </div>
  );
}
