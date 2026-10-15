import { useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import Icon from "../Icon";
import PasswordStrength from "../PasswordStrength";
import styles from "../../css/components/settings/Settings.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function PasswordInput({ id, label, value, onChange, error, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <div className={styles.passwordWrap}>
        <input
          id={id}
          type={show ? "text" : "password"}
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className={styles.eyeBtn}
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
        >
          <Icon name={show ? "eyeOff" : "eye"} size={17} />
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

function EmailForm({ onToast }) {
  const { profile, updateProfile } = useProfile();
  const [email, setEmail] = useState(profile.email);
  const [error, setError] = useState("");
  const dirty = email.trim() !== profile.email;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("รูปแบบอีเมลไม่ถูกต้อง");
      return;
    }
    updateProfile({ email: email.trim() });
    setError("");
    onToast?.("เปลี่ยนอีเมลแล้ว");
  };

  return (
    <form className={styles.section} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.title}>อีเมล</h2>
      <p className={styles.desc}>ใช้สำหรับเข้าสู่ระบบและรับการแจ้งเตือน</p>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="sec-email">อีเมล</label>
        <input
          id="sec-email"
          type="email"
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>
      <div className={styles.actions}>
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary}`}
          disabled={!dirty}
        >
          เปลี่ยนอีเมล
        </button>
      </div>
    </form>
  );
}

const EMPTY_PW = { current: "", next: "", confirm: "" };

function PasswordForm({ onToast }) {
  const [form, setForm] = useState(EMPTY_PW);
  const [errors, setErrors] = useState({});
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });


  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.current) errs.current = "กรุณากรอกรหัสผ่านปัจจุบัน";
    if (form.next.length < 8) errs.next = "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร";
    else if (form.next === form.current) errs.next = "รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสเดิม";
    if (form.confirm !== form.next) errs.confirm = "รหัสผ่านไม่ตรงกัน";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    // TODO: เชื่อมต่อ API เปลี่ยนรหัสผ่าน
    setForm(EMPTY_PW);
    onToast?.("เปลี่ยนรหัสผ่านแล้ว");
  };

  return (
    <form className={styles.section} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.title}>เปลี่ยนรหัสผ่าน</h2>
      <p className={styles.desc}>
        ควรใช้อย่างน้อย 8 ตัวอักษร ผสมตัวพิมพ์ใหญ่-เล็ก ตัวเลข และสัญลักษณ์
      </p>

      <PasswordInput
        id="pw-current"
        label="รหัสผ่านปัจจุบัน"
        value={form.current}
        onChange={set("current")}
        error={errors.current}
        autoComplete="current-password"
      />
      <div className={styles.row}>
        <div>
          <PasswordInput
            id="pw-new"
            label="รหัสผ่านใหม่"
            value={form.next}
            onChange={set("next")}
            error={errors.next}
            autoComplete="new-password"
          />
          <PasswordStrength password={form.next} />
        </div>
        <PasswordInput
          id="pw-confirm"
          label="ยืนยันรหัสผ่านใหม่"
          value={form.confirm}
          onChange={set("confirm")}
          error={errors.confirm}
          autoComplete="new-password"
        />
      </div>

      <div className={styles.actions}>
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary}`}
          disabled={!form.current && !form.next && !form.confirm}
        >
          เปลี่ยนรหัสผ่าน
        </button>
      </div>
    </form>
  );
}

export default function SecuritySettings({ onToast }) {
  return (
    <>
      <EmailForm onToast={onToast} />
      <PasswordForm onToast={onToast} />
    </>
  );
}
