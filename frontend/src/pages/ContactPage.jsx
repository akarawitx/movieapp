import { useState } from "react";
import Icon from "../components/Icon";
import styles from "../css/pages/ContactPage.module.css";

const INFO = [
  { icon: "mail", label: "อีเมล", value: "support@pixelfilm.com" },
  { icon: "phone", label: "โทรศัพท์", value: "02-123-4567" },
  { icon: "pin", label: "ที่อยู่", value: "123 ถนนสุขุมวิท กรุงเทพมหานคร 10110" },
  { icon: "clock", label: "เวลาทำการ", value: "จันทร์ – ศุกร์ 09:00 – 18:00 น." },
];

const SUBJECTS = ["สอบถามทั่วไป", "แจ้งปัญหาการใช้งาน", "เสนอแนะ / ติชม", "ความร่วมมือทางธุรกิจ"];

function Field({ label, children }) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
    </label>
  );
}

export default function ContactPage({ onToast }) {
  const empty = { name: "", email: "", subject: SUBJECTS[0], message: "" };
  const [form, setForm] = useState(empty);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      onToast?.("กรุณากรอกข้อมูลให้ครบถ้วน", "⚠️");
      return;
    }
    // TODO: ต่อ API ส่งข้อความจริงในอนาคต
    onToast?.("ส่งข้อความเรียบร้อยแล้ว เราจะติดต่อกลับโดยเร็ว");
    setForm(empty);
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <span className={styles.badge}>ติดต่อเรา</span>
        <h1 className={styles.heroTitle}>มีอะไรให้เราช่วยไหม?</h1>
        <p className={styles.heroDesc}>
          ส่งข้อความถึงทีมงาน PixelFilm ได้ตลอดเวลา
          เราพร้อมรับฟังทั้งคำถาม ข้อเสนอแนะ และปัญหาการใช้งาน
        </p>
      </section>

      <div className="container">
        <div className={styles.layout}>
          {/* Info */}
          <div className={styles.infoList}>
            {INFO.map((item) => (
              <div key={item.label} className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <Icon name={item.icon} />
                </div>
                <div>
                  <div className={styles.infoLabel}>{item.label}</div>
                  <div className={styles.infoValue}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.formTitle}>ส่งข้อความถึงเรา</h2>

            <Field label="ชื่อ-นามสกุล">
              <input
                className={styles.input}
                value={form.name}
                onChange={set("name")}
                placeholder="ชื่อของคุณ"
              />
            </Field>
            <Field label="อีเมล">
              <input
                type="email"
                className={styles.input}
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
              />
            </Field>
            <Field label="หัวข้อ">
              <select
                className={styles.input}
                value={form.subject}
                onChange={set("subject")}
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ข้อความ">
              <textarea
                rows={5}
                className={`${styles.input} ${styles.textarea}`}
                value={form.message}
                onChange={set("message")}
                placeholder="เขียนข้อความของคุณที่นี่..."
              />
            </Field>

            <button type="submit" className={styles.submit}>
              ส่งข้อความ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}