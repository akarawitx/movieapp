import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useLoginPrompt from "../hooks/useLoginPrompt";
import PasswordStrength from "../components/PasswordStrength";
import Icon from "../components/Icon";
import styles from "../css/pages/PasswordRecovery.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_SECONDS = 30;

function Shell({ icon, title, subtitle, children }) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.icon}>
          <Icon name={icon} size={26} />
        </span>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

/* ═════════ /forgot-password ═════════ */
export function ForgotPasswordPage() {
  const promptLogin = useLoginPrompt();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const send = (e) => {
    e?.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError("กรุณากรอกอีเมลให้ถูกต้อง");
      return;
    }
    // TODO: เรียก API ส่งอีเมลรีเซ็ตรหัสผ่าน
    setError("");
    setSentTo(value);
    setCooldown(RESEND_SECONDS);
  };

  const backToLogin = (
    <button className={styles.textBtn} onClick={() => promptLogin("เข้าสู่ระบบด้วยรหัสผ่านของคุณ")}>
      ← กลับไปหน้าเข้าสู่ระบบ
    </button>
  );

  if (sentTo) {
    return (
      <Shell
        icon="mail"
        title="ตรวจสอบอีเมลของคุณ"
        subtitle={`หากมีบัญชีที่ใช้อีเมล ${sentTo} เราได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้แล้ว ลิงก์จะหมดอายุภายใน 30 นาที`}
      >
        <div className={styles.demo}>
          <strong>โหมดสาธิต</strong>
          <span>ระบบยังไม่ได้ส่งอีเมลจริง กดปุ่มด้านล่างเพื่อเปิดลิงก์แทนได้เลย</span>
          <Link
            className={styles.btnPrimary}
            to={`/reset-password?token=demo&email=${encodeURIComponent(sentTo)}`}
          >
            เปิดลิงก์ตั้งรหัสผ่านใหม่
          </Link>
        </div>

        <p className={styles.small}>
          ไม่ได้รับอีเมล? ตรวจสอบโฟลเดอร์สแปม หรือ{" "}
          {cooldown > 0 ? (
            <span className={styles.muted}>ส่งอีกครั้งได้ใน {cooldown} วินาที</span>
          ) : (
            <button className={styles.linkBtn} onClick={() => send()}>
              ส่งอีกครั้ง
            </button>
          )}
        </p>
        <div className={styles.footer}>
          <button className={styles.textBtn} onClick={() => setSentTo(null)}>
            ใช้อีเมลอื่น
          </button>
          {backToLogin}
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      icon="lock"
      title="ลืมรหัสผ่าน?"
      subtitle="กรอกอีเมลที่ใช้สมัครสมาชิก เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้"
    >
      <form onSubmit={send} noValidate className={styles.form}>
        <label className={styles.label} htmlFor="fp-email">
          อีเมล
        </label>
        <input
          id="fp-email"
          type="email"
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          autoFocus
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.btnPrimary}>
          ส่งลิงก์ตั้งรหัสผ่านใหม่
        </button>
      </form>
      <div className={styles.footer}>{backToLogin}</div>
    </Shell>
  );
}

/* ═════════ /reset-password ═════════ */
const RULES = [
  { label: "อย่างน้อย 8 ตัวอักษร", test: (pw) => pw.length >= 8 },
  { label: "มีตัวพิมพ์เล็กและพิมพ์ใหญ่", test: (pw) => /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
  { label: "มีตัวเลขอย่างน้อย 1 ตัว", test: (pw) => /\d/.test(pw) },
];

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const promptLogin = useLoginPrompt();
  const token = params.get("token");
  const email = params.get("email");
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <Shell
        icon="alert"
        title="ลิงก์ไม่ถูกต้องหรือหมดอายุ"
        subtitle="ลิงก์ตั้งรหัสผ่านใหม่นี้ใช้ไม่ได้แล้ว กรุณาขอลิงก์ใหม่อีกครั้ง"
      >
        <Link to="/forgot-password" className={styles.btnPrimary}>
          ขอลิงก์ใหม่
        </Link>
      </Shell>
    );
  }

  if (done) {
    return (
      <Shell
        icon="check"
        title="ตั้งรหัสผ่านใหม่เรียบร้อย"
        subtitle="ใช้รหัสผ่านใหม่เข้าสู่ระบบได้ทันที"
      >
        <button
          className={styles.btnPrimary}
          onClick={() => promptLogin("เข้าสู่ระบบด้วยรหัสผ่านใหม่ของคุณ")}
        >
          เข้าสู่ระบบ
        </button>
      </Shell>
    );
  }

  const rulesOk = RULES.every((r) => r.test(form.password));
  const matches = form.password === form.confirm;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!rulesOk || !matches) return;
    // TODO: เรียก API ตั้งรหัสผ่านใหม่ด้วย token
    setDone(true);
  };

  return (
    <Shell
      icon="lock"
      title="ตั้งรหัสผ่านใหม่"
      subtitle={email ? `สำหรับบัญชี ${email}` : "กรอกรหัสผ่านใหม่ที่ต้องการใช้"}
    >
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <label className={styles.label} htmlFor="rp-password">
          รหัสผ่านใหม่
        </label>
        <div className={styles.passwordWrap}>
          <input
            id="rp-password"
            type={show ? "text" : "password"}
            className={`${styles.input} ${submitted && !rulesOk ? styles.inputError : ""}`}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="new-password"
            autoFocus
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
        <div className={styles.strength}>
          <PasswordStrength password={form.password} />
        </div>

        <ul className={styles.rules}>
          {RULES.map((r) => {
            const ok = r.test(form.password);
            return (
              <li key={r.label} className={ok ? styles.ruleOk : ""}>
                <Icon name={ok ? "check" : "close"} size={13} />
                {r.label}
              </li>
            );
          })}
        </ul>

        <label className={styles.label} htmlFor="rp-confirm">
          ยืนยันรหัสผ่านใหม่
        </label>
        <input
          id="rp-confirm"
          type={show ? "text" : "password"}
          className={`${styles.input} ${submitted && !matches ? styles.inputError : ""}`}
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          autoComplete="new-password"
        />
        {submitted && !matches && <p className={styles.error}>รหัสผ่านไม่ตรงกัน</p>}
        {submitted && !rulesOk && (
          <p className={styles.error}>รหัสผ่านยังไม่ตรงตามเงื่อนไขด้านบน</p>
        )}

        <button type="submit" className={styles.btnPrimary}>
          บันทึกรหัสผ่านใหม่
        </button>
      </form>
    </Shell>
  );
}
