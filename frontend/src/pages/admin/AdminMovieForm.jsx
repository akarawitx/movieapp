import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import { useAccounts } from "../../context/AccountsContext";
import { MOVIE_STATUSES, RATINGS, slugify } from "../../data/catalog";
import Poster from "../../components/Poster";
import Icon from "../../components/Icon";
import { ConfirmDialog, PageHead } from "../../components/admin/AdminUi";
import NotFoundPage from "../NotFoundPage";
import styles from "../../css/pages/admin/Admin.module.css";

const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const URL_RE = /^https?:\/\/\S+$/i;
const THIS_YEAR = new Date().getFullYear();

const parseDuration = (d) => {
  const m = /(?:(\d+)h)?\s*(?:(\d+)m)?/.exec(d ?? "");
  return { hours: m?.[1] ?? "", minutes: m?.[2] ?? "" };
};

const EMPTY = {
  id: "",
  title: "",
  year: String(THIS_YEAR),
  hours: "",
  minutes: "",
  genre: "",
  rated: "PG-13",
  releaseDate: "",
  status: "published",
  director: "",
  cast: "",
  synopsis: "",
  language: "อังกฤษ",
  country: "",
  studio: "",
  poster: "",
  backdrop: "",
  score: "0",
  reviews: "0",
};

const toForm = (m) => ({
  ...EMPTY,
  ...Object.fromEntries(Object.entries(m).map(([k, v]) => [k, v ?? ""])),
  ...parseDuration(m.duration),
  year: String(m.year),
  score: String(m.score),
  reviews: String(m.reviews),
});

function validate(f, { isNew, takenIds }) {
  const e = {};
  if (!f.title.trim()) e.title = "กรุณากรอกชื่อเรื่อง";
  if (isNew) {
    if (!f.id) e.id = "กรุณากรอก id (ใช้ใน URL)";
    else if (!ID_RE.test(f.id)) e.id = "ใช้ได้เฉพาะ a-z, 0-9 และ - (เช่น dune-part-two)";
    else if (takenIds.includes(f.id)) e.id = "id นี้ถูกใช้แล้ว";
  }
  const year = Number(f.year);
  if (!Number.isInteger(year) || year < 1888 || year > THIS_YEAR + 10) e.year = "ปีไม่ถูกต้อง";
  const h = Number(f.hours || 0);
  const m = Number(f.minutes || 0);
  if (!Number.isInteger(h) || !Number.isInteger(m) || h < 0 || m < 0 || m > 59 || h * 60 + m === 0) {
    e.duration = "กรอกความยาวเป็นชั่วโมงและนาที (นาที 0–59)";
  }
  if (!f.genre) e.genre = "กรุณาเลือกแนวหนัง";
  if (!f.director.trim()) e.director = "กรุณากรอกชื่อผู้กำกับ";
  if (!f.synopsis.trim()) e.synopsis = "กรุณากรอกเรื่องย่อ";
  else if (f.synopsis.trim().length < 20) e.synopsis = "เรื่องย่อควรยาวอย่างน้อย 20 ตัวอักษร";
  if (f.poster && !URL_RE.test(f.poster)) e.poster = "ลิงก์ต้องขึ้นต้นด้วย http:// หรือ https://";
  if (f.backdrop && !URL_RE.test(f.backdrop)) e.backdrop = "ลิงก์ต้องขึ้นต้นด้วย http:// หรือ https://";
  const score = Number(f.score);
  if (f.score === "" || Number.isNaN(score) || score < 0 || score > 10) e.score = "คะแนน 0–10";
  const reviews = Number(f.reviews);
  if (!Number.isInteger(reviews) || reviews < 0) e.reviews = "ต้องเป็นจำนวนเต็มตั้งแต่ 0";
  return e;
}

const toMovie = (f) => ({
  id: f.id,
  title: f.title.trim(),
  year: Number(f.year),
  duration: `${Number(f.hours || 0)}h ${Number(f.minutes || 0)}m`,
  genre: f.genre,
  rated: f.rated,
  releaseDate: f.releaseDate || null,
  status: f.status,
  director: f.director.trim(),
  cast: f.cast
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", "),
  synopsis: f.synopsis.trim(),
  language: f.language.trim(),
  country: f.country.trim(),
  studio: f.studio.trim(),
  poster: f.poster.trim(),
  backdrop: f.backdrop.trim(),
  score: Math.round(Number(f.score) * 10) / 10,
  reviews: Number(f.reviews),
});

// htmlFor ผูก label กับช่องกรอก (โปรแกรมอ่านหน้าจอและเทสต์หาช่องจากชื่อ label ได้)
function Field({ label, htmlFor, required, error, hint, full, children }) {
  return (
    <div className={`${styles.field} ${full ? styles.full : ""}`}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
        {required && <span className={styles.required} aria-hidden="true">*</span>}
      </label>
      {children}
      {error ? <span className={styles.error}>{error}</span> : hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHead}>
        <h2 className={styles.cardTitle}>{title}</h2>
      </div>
      <div className={styles.cardBody}>{children}</div>
    </section>
  );
}

export default function AdminMovieForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { notify } = useOutletContext();
  const { allMovies, genres, getMovie, createMovie, updateMovie } = useCatalog();
  const { logAction } = useAccounts();
  const original = isNew ? null : getMovie(id);

  const [form, setForm] = useState(() => (original ? toForm(original) : EMPTY));
  const [initial] = useState(form);
  const [idTouched, setIdTouched] = useState(!isNew);
  const [submitted, setSubmitted] = useState(false);
  const [leaveTo, setLeaveTo] = useState(null);

  const errors = validate(form, { isNew, takenIds: allMovies.map((m) => m.id) });
  const shownErrors = submitted ? errors : {};
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  // เตือนก่อนปิดแท็บ/รีเฟรชถ้ายังไม่บันทึก
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  if (!isNew && !original) return <NotFoundPage />;

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => {
      const next = { ...f, [key]: value };
      // id ตามชื่อเรื่องอัตโนมัติจนกว่าจะแก้ id เอง (เฉพาะตอนเพิ่มใหม่)
      if (key === "title" && isNew && !idTouched) next.id = slugify(value);
      return next;
    });
  };

  const leave = (to) => (dirty ? setLeaveTo(to) : navigate(to));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const movie = toMovie(form);
    if (isNew) {
      createMovie(movie);
      logAction("เพิ่มหนัง", movie.title);
      notify(`เพิ่ม "${movie.title}" แล้ว`);
    } else {
      updateMovie(id, movie);
      logAction("แก้ไขหนัง", movie.title);
      notify(`บันทึก "${movie.title}" แล้ว`);
    }
    navigate("/admin/movies");
  };

  const genreLabel = genres.find((g) => g.id === form.genre)?.label;
  const errorCount = Object.keys(shownErrors).length;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <button type="button" className={styles.backLink} onClick={() => leave("/admin/movies")}>
        <Icon name="arrowLeft" size={15} />
        กลับไปรายการหนัง
      </button>
      <PageHead
        title={isNew ? "เพิ่มหนังใหม่" : `แก้ไข: ${original.title}`}
        desc={isNew ? "กรอกข้อมูลหนังที่จะแสดงบนหน้าเว็บ ช่องที่มี * ต้องกรอก" : `id: ${id} · แก้ไขแล้วจะแสดงบนหน้าเว็บทันที`}
        actions={
          <>
            {!isNew && (
              <Link to={`/movies/${id}`} className={`${styles.btn} ${styles.btnGhost}`}>
                <Icon name="eye" size={15} />
                ดูบนหน้าเว็บ
              </Link>
            )}
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
              <Icon name="check" size={15} />
              {isNew ? "เพิ่มหนัง" : "บันทึกการแก้ไข"}
            </button>
          </>
        }
      />

      {errorCount > 0 && (
        <div className={`${styles.errorSummary} ${styles.spaced}`} role="alert">
          <Icon name="alert" size={16} />
          ยังมีข้อมูลที่ต้องแก้ไข {errorCount} ช่อง
        </div>
      )}

      <div className={styles.formGrid}>
        <div className={styles.formMain}>
          <Section title="ข้อมูลหลัก">
            <div className={styles.fields}>
              <Field label="ชื่อเรื่อง" htmlFor="mf-title" required error={shownErrors.title} full>
                <input id="mf-title"
                  className={`${styles.input} ${shownErrors.title ? styles.inputError : ""}`}
                  value={form.title}
                  onChange={set("title")}
                  placeholder="เช่น Dune: Part Two"
                  autoFocus={isNew}
                />
              </Field>
              <Field
                label="id (ใช้ใน URL)" htmlFor="mf-id"
                required={isNew}
                error={shownErrors.id}
                hint={isNew ? "สร้างจากชื่อเรื่องอัตโนมัติ แก้ได้ · เปลี่ยนไม่ได้หลังบันทึก" : "เปลี่ยนไม่ได้ เพื่อไม่ให้ลิงก์เดิมเสีย"}
                full
              >
                <div className={styles.prefix}>
                  <span>/movies/</span>
                  <input id="mf-id"
                    className={`${styles.input} ${shownErrors.id ? styles.inputError : ""}`}
                    value={form.id}
                    onChange={(e) => {
                      setIdTouched(true);
                      set("id")(e);
                    }}
                    disabled={!isNew}
                    placeholder="dune-part-two"
                  />
                </div>
              </Field>
              <Field label="แนวหนัง" htmlFor="mf-genre" required error={shownErrors.genre}>
                <select id="mf-genre"
                  className={`${styles.select} ${shownErrors.genre ? styles.inputError : ""}`}
                  value={form.genre}
                  onChange={set("genre")}
                >
                  <option value="">— เลือกแนว —</option>
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="เรตติ้ง" htmlFor="mf-rated">
                <select id="mf-rated" className={styles.select} value={form.rated} onChange={set("rated")}>
                  {RATINGS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="ปีที่ออกฉาย" htmlFor="mf-year" required error={shownErrors.year}>
                <input id="mf-year"
                  type="number"
                  className={`${styles.input} ${shownErrors.year ? styles.inputError : ""}`}
                  value={form.year}
                  onChange={set("year")}
                  min="1888"
                  max={THIS_YEAR + 10}
                />
              </Field>
              <Field label="วันที่เข้าฉาย" htmlFor="mf-release-date" hint="ใช้ในหน้าปฏิทินฉาย และตัวเรียง “เร็วๆ นี้”">
                <input id="mf-release-date"
                  type="date"
                  className={styles.input}
                  value={form.releaseDate}
                  onChange={set("releaseDate")}
                />
              </Field>
              <Field label="ความยาว" required error={shownErrors.duration}>
                <div className={styles.inline}>
                  <div className={styles.prefix}>
                    <span>ชม.</span>
                    <input
                      type="number"
                      className={`${styles.input} ${shownErrors.duration ? styles.inputError : ""}`}
                      value={form.hours}
                      onChange={set("hours")}
                      min="0"
                      placeholder="ชั่วโมง"
                      aria-label="ชั่วโมง"
                    />
                  </div>
                  <div className={styles.prefix}>
                    <span>นาที</span>
                    <input
                      type="number"
                      className={`${styles.input} ${shownErrors.duration ? styles.inputError : ""}`}
                      value={form.minutes}
                      onChange={set("minutes")}
                      min="0"
                      max="59"
                      placeholder="นาที"
                      aria-label="นาที"
                    />
                  </div>
                </div>
              </Field>
              <Field label="สถานะ">
                <div className={styles.radios}>
                  {MOVIE_STATUSES.map((s) => (
                    <label
                      key={s.id}
                      className={`${styles.radio} ${form.status === s.id ? styles.radioOn : ""}`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={s.id}
                        checked={form.status === s.id}
                        onChange={set("status")}
                      />
                      {s.label}
                    </label>
                  ))}
                </div>
              </Field>
            </div>
          </Section>

          <Section title="เรื่องย่อและทีมงาน">
            <div className={styles.fields}>
              <Field label="เรื่องย่อ" htmlFor="mf-synopsis" required error={shownErrors.synopsis} full>
                <textarea id="mf-synopsis"
                  className={`${styles.textarea} ${shownErrors.synopsis ? styles.inputError : ""}`}
                  value={form.synopsis}
                  onChange={set("synopsis")}
                  rows={4}
                />
              </Field>
              <Field label="ผู้กำกับ" htmlFor="mf-director" required error={shownErrors.director}>
                <input id="mf-director"
                  className={`${styles.input} ${shownErrors.director ? styles.inputError : ""}`}
                  value={form.director}
                  onChange={set("director")}
                />
              </Field>
              <Field label="สตูดิโอ" htmlFor="mf-studio">
                <input id="mf-studio" className={styles.input} value={form.studio} onChange={set("studio")} />
              </Field>
              <Field label="นักแสดง" htmlFor="mf-cast" hint="คั่นแต่ละคนด้วยเครื่องหมายจุลภาค (,) คนแรกคือนักแสดงนำ" full>
                <input id="mf-cast"
                  className={styles.input}
                  value={form.cast}
                  onChange={set("cast")}
                  placeholder="Timothée Chalamet, Zendaya"
                />
              </Field>
              <Field label="ภาษา" htmlFor="mf-language">
                <input id="mf-language" className={styles.input} value={form.language} onChange={set("language")} />
              </Field>
              <Field label="ประเทศ" htmlFor="mf-country">
                <input id="mf-country" className={styles.input} value={form.country} onChange={set("country")} />
              </Field>
            </div>
          </Section>

          <Section title="รูปภาพ">
            <div className={styles.fields}>
              <Field label="ลิงก์โปสเตอร์" htmlFor="mf-poster" error={shownErrors.poster} hint="แนะนำสัดส่วน 2:3" full>
                <input id="mf-poster"
                  type="url"
                  className={`${styles.input} ${shownErrors.poster ? styles.inputError : ""}`}
                  value={form.poster}
                  onChange={set("poster")}
                  placeholder="https://..."
                />
              </Field>
              <Field label="ลิงก์ภาพพื้นหลัง (backdrop)" htmlFor="mf-backdrop" error={shownErrors.backdrop} hint="แนะนำสัดส่วน 16:9 · ถ้าไม่ใส่จะใช้โปสเตอร์แทน" full>
                <input id="mf-backdrop"
                  type="url"
                  className={`${styles.input} ${shownErrors.backdrop ? styles.inputError : ""}`}
                  value={form.backdrop}
                  onChange={set("backdrop")}
                  placeholder="https://..."
                />
              </Field>
            </div>
          </Section>

          <Section title="สถิติ (ข้อมูลจำลอง)">
            <div className={styles.fields}>
              <Field label="คะแนนเฉลี่ย" htmlFor="mf-score" error={shownErrors.score} hint="0–10 · เมื่อต่อ backend จะคำนวณจากรีวิวจริง">
                <input id="mf-score"
                  type="number"
                  className={`${styles.input} ${shownErrors.score ? styles.inputError : ""}`}
                  value={form.score}
                  onChange={set("score")}
                  min="0"
                  max="10"
                  step="0.1"
                />
              </Field>
              <Field label="จำนวนรีวิว" htmlFor="mf-reviews" error={shownErrors.reviews} hint="0 = ยังไม่มีรีวิวจากชุมชน">
                <input id="mf-reviews"
                  type="number"
                  className={`${styles.input} ${shownErrors.reviews ? styles.inputError : ""}`}
                  value={form.reviews}
                  onChange={set("reviews")}
                  min="0"
                  step="1"
                />
              </Field>
            </div>
          </Section>
        </div>

        <aside className={styles.formSide}>
          <Section title="ตัวอย่าง">
            <div className={styles.previewPoster}>
              <Poster src={form.poster} title={form.title || "โปสเตอร์"} />
            </div>
            <p className={styles.previewTitle}>{form.title || "ชื่อเรื่อง"}</p>
            <p className={styles.previewMeta}>
              {[form.year, genreLabel, form.rated].filter(Boolean).join(" · ")}
            </p>
            <div className={styles.previewBackdrop}>
              <Poster src={form.backdrop || form.poster} title="ภาพพื้นหลัง" />
            </div>
          </Section>
          <div className={styles.formFooter}>
            <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={() => leave("/admin/movies")}>
              ยกเลิก
            </button>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
              {isNew ? "เพิ่มหนัง" : "บันทึกการแก้ไข"}
            </button>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={!!leaveTo}
        title="ออกโดยไม่บันทึก?"
        icon="alert"
        tone="warn"
        confirmLabel="ออกโดยไม่บันทึก"
        onConfirm={() => navigate(leaveTo)}
        onCancel={() => setLeaveTo(null)}
      >
        การแก้ไขที่ยังไม่ได้บันทึกจะหายไป
      </ConfirmDialog>
    </form>
  );
}
