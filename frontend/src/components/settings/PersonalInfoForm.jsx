import { useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import styles from "../../css/components/settings/Settings.module.css";

const BIO_MAX = 160;
const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

const pick = (p) => ({
  firstName: p.firstName,
  lastName: p.lastName,
  username: p.username,
  bio: p.bio,
  location: p.location,
});

function validate(form) {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = "กรุณากรอกชื่อ";
  if (!form.lastName.trim()) errors.lastName = "กรุณากรอกนามสกุล";
  if (!USERNAME_RE.test(form.username))
    errors.username = "ใช้ได้เฉพาะ a-z, 0-9 และ _ ความยาว 3–20 ตัวอักษร";
  if (form.bio.length > BIO_MAX) errors.bio = `ไม่เกิน ${BIO_MAX} ตัวอักษร`;
  return errors;
}

export default function PersonalInfoForm({ onToast }) {
  const { profile, updateProfile } = useProfile();
  const [form, setForm] = useState(() => pick(profile));
  const [submitted, setSubmitted] = useState(false);

  const original = pick(profile);
  const dirty = Object.keys(form).some((k) => form[k] !== original[k]);
  const errors = validate(form);
  const showErr = (k) => submitted && errors[k];

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) return;
    updateProfile({
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      location: form.location.trim(),
    });
    setSubmitted(false);
    onToast?.("บันทึกข้อมูลส่วนตัวแล้ว");
  };

  const handleCancel = () => {
    setForm(original);
    setSubmitted(false);
  };

  return (
    <form className={styles.section} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.title}>ข้อมูลส่วนตัว</h2>
      <p className={styles.desc}>ข้อมูลที่จะแสดงบนหน้าโปรไฟล์ของคุณ</p>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pi-first">ชื่อ</label>
          <input
            id="pi-first"
            className={`${styles.input} ${showErr("firstName") ? styles.inputError : ""}`}
            value={form.firstName}
            onChange={set("firstName")}
          />
          {showErr("firstName") && <p className={styles.error}>{errors.firstName}</p>}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pi-last">นามสกุล</label>
          <input
            id="pi-last"
            className={`${styles.input} ${showErr("lastName") ? styles.inputError : ""}`}
            value={form.lastName}
            onChange={set("lastName")}
          />
          {showErr("lastName") && <p className={styles.error}>{errors.lastName}</p>}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="pi-username">ชื่อผู้ใช้</label>
        <div className={styles.prefix}>
          <span>@</span>
          <input
            id="pi-username"
            className={`${styles.input} ${showErr("username") ? styles.inputError : ""}`}
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value.toLowerCase() })
            }
            autoComplete="username"
          />
        </div>
        {showErr("username") ? (
          <p className={styles.error}>{errors.username}</p>
        ) : (
          <p className={styles.hint}>ใช้ได้เฉพาะ a-z, 0-9 และ _ ความยาว 3–20 ตัวอักษร</p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="pi-bio">
          แนะนำตัว
          <span className={styles.counter}>
            {form.bio.length}/{BIO_MAX}
          </span>
        </label>
        <textarea
          id="pi-bio"
          className={`${styles.input} ${showErr("bio") ? styles.inputError : ""}`}
          value={form.bio}
          maxLength={BIO_MAX}
          onChange={set("bio")}
          placeholder="เล่าสั้นๆ ว่าคุณชอบหนังแบบไหน"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="pi-location">ที่อยู่ (ไม่บังคับ)</label>
        <input
          id="pi-location"
          className={styles.input}
          value={form.location}
          onChange={set("location")}
          placeholder="เช่น กรุงเทพมหานคร"
        />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnGhost}`}
          onClick={handleCancel}
          disabled={!dirty}
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary}`}
          disabled={!dirty}
        >
          บันทึกการเปลี่ยนแปลง
        </button>
      </div>
    </form>
  );
}
