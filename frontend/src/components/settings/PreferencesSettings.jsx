import { useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import { PROFILE_GENRES } from "../../data/profile";
import styles from "../../css/components/settings/Settings.module.css";

const pick = (p) => ({
  favoriteGenres: p.favoriteGenres,
  publicProfile: p.privacy.publicProfile,
  showWatchlist: p.privacy.showWatchlist,
  emailNotify: p.notifications.email,
});

function Toggle({ title, desc, checked, onChange }) {
  return (
    <label className={styles.toggleRow}>
      <span className={styles.toggleText}>
        <strong>{title}</strong>
        <span>{desc}</span>
      </span>
      <span className={styles.switch}>
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className={styles.switchTrack} />
      </span>
    </label>
  );
}

export default function PreferencesSettings({ onToast }) {
  const { profile, updateProfile } = useProfile();
  const [form, setForm] = useState(() => pick(profile));

  const original = pick(profile);
  const dirty =
    form.publicProfile !== original.publicProfile ||
    form.showWatchlist !== original.showWatchlist ||
    form.emailNotify !== original.emailNotify ||
    [...form.favoriteGenres].sort().join() !==
      [...original.favoriteGenres].sort().join();

  const toggleGenre = (id) =>
    setForm({
      ...form,
      favoriteGenres: form.favoriteGenres.includes(id)
        ? form.favoriteGenres.filter((g) => g !== id)
        : [...form.favoriteGenres, id],
    });

  const handleSave = () => {
    updateProfile({
      favoriteGenres: form.favoriteGenres,
      privacy: { publicProfile: form.publicProfile, showWatchlist: form.showWatchlist },
      notifications: { email: form.emailNotify },
    });
    onToast?.("บันทึกการตั้งค่าแล้ว");
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>ความชอบและความเป็นส่วนตัว</h2>
      <p className={styles.desc}>ปรับแต่งการแนะนำหนังและกำหนดว่าใครจะเห็นข้อมูลของคุณ</p>

      <h3 className={styles.subTitle} style={{ marginTop: 0 }}>แนวหนังที่ชอบ</h3>
      <div className={styles.chips}>
        {PROFILE_GENRES.map((g) => {
          const active = form.favoriteGenres.includes(g.id);
          return (
            <button
              key={g.id}
              type="button"
              aria-pressed={active}
              className={`${styles.chip} ${active ? styles.chipActive : ""}`}
              onClick={() => toggleGenre(g.id)}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      <h3 className={styles.subTitle}>ความเป็นส่วนตัว</h3>
      <Toggle
        title="โปรไฟล์สาธารณะ"
        desc="ผู้ใช้อื่นสามารถดูโปรไฟล์และรีวิวของคุณได้"
        checked={form.publicProfile}
        onChange={(v) => setForm({ ...form, publicProfile: v })}
      />
      <Toggle
        title="แสดงรายการอยากดู"
        desc="ให้ผู้อื่นเห็น Watchlist บนโปรไฟล์ของคุณ"
        checked={form.showWatchlist}
        onChange={(v) => setForm({ ...form, showWatchlist: v })}
      />

      <h3 className={styles.subTitle}>การแจ้งเตือน</h3>
      <Toggle
        title="แจ้งเตือนทางอีเมล"
        desc="รับอีเมลเมื่อมีคนตอบกลับรีวิว หรือมีหนังใหม่ในแนวที่คุณชอบ"
        checked={form.emailNotify}
        onChange={(v) => setForm({ ...form, emailNotify: v })}
      />

      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.btnGhost}`}
          onClick={() => setForm(original)}
          disabled={!dirty}
        >
          ยกเลิก
        </button>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleSave}
          disabled={!dirty}
        >
          บันทึกการตั้งค่า
        </button>
      </div>
    </section>
  );
}
