import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";
import useLoginPrompt from "../../hooks/useLoginPrompt";
import { getRatingDistribution } from "../../data/movieDetails";
import useCommunityReviews from "../../hooks/useCommunityReviews";
import Avatar from "../Avatar";
import Icon from "../Icon";
import styles from "../../css/components/movie/ReviewSection.module.css";

const PAGE_SIZE = 4;
const BODY_MIN = 10;
const BODY_MAX = 1000;

const SORTS = [
  { id: "recent", label: "ล่าสุด" },
  { id: "likes", label: "ถูกใจมากที่สุด" },
  { id: "high", label: "คะแนนสูง" },
  { id: "low", label: "คะแนนต่ำ" },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/* ── คะแนนรวม + สัดส่วน ── */
function RatingSummary({ movie, total }) {
  const dist = getRatingDistribution(movie);
  const stars = Math.round(movie.score / 2);
  return (
    <div className={styles.summary}>
      <div className={styles.summaryScore}>
        <div className={styles.bigScore}>
          {movie.score.toFixed(1)}
          <span>/10</span>
        </div>
        <div className={styles.summaryStars} aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={i <= stars ? styles.on : ""}>★</span>
          ))}
        </div>
        <div className={styles.summaryCount}>
          จาก {total.toLocaleString()} รีวิว
        </div>
      </div>
      <div className={styles.bars}>
        {dist.map((d) => (
          <div key={d.label} className={styles.barRow}>
            <span className={styles.barLabel}>{d.label}</span>
            <span className={styles.barTrack}>
              <span className={styles.barFill} style={{ width: `${d.percent}%` }} />
            </span>
            <span className={styles.barPct}>{d.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── เลือกคะแนน 1–10 ── */
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className={styles.picker} role="radiogroup" aria-label="ให้คะแนน 1 ถึง 10">
      <div className={styles.pickerStars} onMouseLeave={() => setHover(0)}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} คะแนน`}
            className={`${styles.pickStar} ${n <= shown ? styles.on : ""}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
          >
            ★
          </button>
        ))}
      </div>
      <span className={styles.pickerValue}>
        {shown ? `${shown}/10` : "ยังไม่ได้ให้คะแนน"}
      </span>
    </div>
  );
}

/* ── ฟอร์มเขียน/แก้ไขรีวิว ── */
function ReviewForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial ?? { score: 0, title: "", body: "", spoiler: false }
  );
  const [submitted, setSubmitted] = useState(false);

  const errors = {};
  if (!form.score) errors.score = "กรุณาให้คะแนน";
  if (form.body.trim().length < BODY_MIN)
    errors.body = `เขียนรีวิวอย่างน้อย ${BODY_MIN} ตัวอักษร`;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) return;
    onSubmit({ ...form, title: form.title.trim(), body: form.body.trim() });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formHead}>
        <h3>{initial ? "แก้ไขรีวิวของคุณ" : "เขียนรีวิวของคุณ"}</h3>
      </div>

      <StarPicker value={form.score} onChange={(score) => setForm({ ...form, score })} />
      {submitted && errors.score && <p className={styles.error}>{errors.score}</p>}

      <input
        className={styles.input}
        placeholder="หัวข้อรีวิว (ไม่บังคับ)"
        maxLength={80}
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <div className={styles.textareaWrap}>
        <textarea
          className={`${styles.input} ${styles.textarea} ${
            submitted && errors.body ? styles.inputError : ""
          }`}
          placeholder="หนังเรื่องนี้เป็นอย่างไรบ้าง? เล่าให้คนอื่นฟังหน่อย"
          maxLength={BODY_MAX}
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        />
        <span className={styles.counter}>
          {form.body.length}/{BODY_MAX}
        </span>
      </div>
      {submitted && errors.body && <p className={styles.error}>{errors.body}</p>}

      <div className={styles.formFoot}>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={form.spoiler}
            onChange={(e) => setForm({ ...form, spoiler: e.target.checked })}
          />
          มีสปอยล์
        </label>
        <div className={styles.formBtns}>
          {onCancel && (
            <button type="button" className={styles.btnGhost} onClick={onCancel}>
              ยกเลิก
            </button>
          )}
          <button type="submit" className={styles.btnPrimary}>
            {initial ? "บันทึกการแก้ไข" : "เผยแพร่รีวิว"}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ── การ์ดรีวิว ── */
function ReviewCard({ review, liked, onLike, mine, avatar, actions }) {
  const [revealed, setRevealed] = useState(false);
  const hidden = review.spoiler && !revealed;

  return (
    <article className={`${styles.card} ${mine ? styles.cardMine : ""}`}>
      <header className={styles.cardHead}>
        <div className={styles.who}>
          {mine ? (
            <Avatar src={avatar} size={40} />
          ) : (
            <Link to={`/u/${review.username}`} aria-label={`โปรไฟล์ของ ${review.name}`}>
              <span className={styles.initials} style={{ background: review.color }}>
                {review.name.slice(0, 2)}
              </span>
            </Link>
          )}
          <div>
            <div className={styles.name}>
              {mine ? (
                review.name
              ) : (
                <Link to={`/u/${review.username}`} className={styles.nameLink}>
                  {review.name}
                </Link>
              )}
              {mine && <span className={styles.mineTag}>รีวิวของคุณ</span>}
            </div>
            <time className={styles.date}>{formatDate(review.date)}</time>
          </div>
        </div>
        <span className={styles.scoreBadge}>★ {review.score}/10</span>
      </header>

      {review.title && <h4 className={styles.cardTitle}>{review.title}</h4>}

      <div className={styles.bodyWrap}>
        <p className={`${styles.body} ${hidden ? styles.blurred : ""}`}>{review.body}</p>
        {hidden && (
          <button className={styles.spoilerBtn} onClick={() => setRevealed(true)}>
            <Icon name="eye" size={15} />
            รีวิวนี้มีสปอยล์ — แตะเพื่ออ่าน
          </button>
        )}
      </div>

      <footer className={styles.cardFoot}>
        {onLike && (
          <button
            className={`${styles.likeBtn} ${liked ? styles.liked : ""}`}
            onClick={onLike}
            aria-pressed={liked}
          >
            ♥ {review.likes + (liked ? 1 : 0)}
          </button>
        )}
        {actions}
      </footer>
    </article>
  );
}

export default function ReviewSection({ movie, user, onToast }) {
  const { profile, getMyReview, saveReview, deleteReview } = useProfile();
  const promptLogin = useLoginPrompt();
  const [sort, setSort] = useState("recent");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [liked, setLiked] = useState(() => new Set());
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { getReviews } = useCommunityReviews();

  const myReview = user ? getMyReview(movie.id) : null;
  const total = movie.reviews + (myReview ? 1 : 0);

  const reviews = useMemo(() => {
    const list = getReviews(movie);
    const by = {
      recent: (a, b) => b.date.localeCompare(a.date),
      likes: (a, b) => b.likes - a.likes,
      high: (a, b) => b.score - a.score,
      low: (a, b) => a.score - b.score,
    }[sort];
    return [...list].sort(by);
  }, [movie, sort, getReviews]);

  const toggleLike = (id) => {
    if (!user) return promptLogin("เข้าสู่ระบบเพื่อกดถูกใจรีวิว");
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = (data) => {
    saveReview(movie.id, data);
    onToast?.(myReview ? "บันทึกการแก้ไขรีวิวแล้ว" : "เผยแพร่รีวิวสำเร็จ!");
    setEditing(false);
  };

  const handleDelete = () => {
    deleteReview(movie.id);
    setConfirmDelete(false);
    onToast?.("ลบรีวิวแล้ว", "🗑️");
  };

  const fullName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : "";

  return (
    <div className={styles.wrap}>
      <RatingSummary movie={movie} total={total} />

      {/* ── ส่วนรีวิวของผู้ใช้ ── */}
      <div id="write-review" className={styles.mine}>
        {!user ? (
          <div className={styles.loginCta}>
            <div>
              <strong>เคยดูเรื่องนี้แล้ว?</strong>
              <p>เข้าสู่ระบบเพื่อให้คะแนนและแบ่งปันความคิดเห็นของคุณ</p>
            </div>
            <button
              className={styles.btnPrimary}
              onClick={() => promptLogin("เข้าสู่ระบบเพื่อเขียนรีวิว")}
            >
              เขียนรีวิว
            </button>
          </div>
        ) : myReview && !editing ? (
          <>
            <ReviewCard
              mine
              avatar={profile?.avatar}
              review={{ ...myReview, name: fullName || profile.username, likes: 0 }}
              actions={
                <div className={styles.ownerActions}>
                  <button className={styles.textBtn} onClick={() => setEditing(true)}>
                    <Icon name="edit" size={14} /> แก้ไข
                  </button>
                  <button
                    className={`${styles.textBtn} ${styles.textDanger}`}
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Icon name="trash" size={14} /> ลบ
                  </button>
                </div>
              }
            />
            {confirmDelete && (
              <div className={styles.confirm} role="alertdialog">
                <span>ต้องการลบรีวิวนี้ใช่ไหม? คะแนนที่ให้ไว้จะถูกลบด้วย</span>
                <div className={styles.formBtns}>
                  <button className={styles.btnGhost} onClick={() => setConfirmDelete(false)}>
                    ยกเลิก
                  </button>
                  <button className={styles.btnDanger} onClick={handleDelete}>
                    ลบรีวิว
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <ReviewForm
            key={editing ? "edit" : "new"}
            initial={editing ? myReview : null}
            onSubmit={handleSave}
            onCancel={editing ? () => setEditing(false) : null}
          />
        )}
      </div>

      {/* ── รีวิวทั้งหมด ── */}
      <div className={styles.toolbar}>
        <span className={styles.toolbarLabel}>เรียงตาม</span>
        <div className={styles.sorts}>
          {SORTS.map((s) => (
            <button
              key={s.id}
              className={`${styles.sortBtn} ${sort === s.id ? styles.sortActive : ""}`}
              aria-pressed={sort === s.id}
              onClick={() => {
                setSort(s.id);
                setVisible(PAGE_SIZE);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {reviews.slice(0, visible).map((r) => (
          <ReviewCard
            key={r.id}
            review={r}
            liked={liked.has(r.id)}
            onLike={() => toggleLike(r.id)}
          />
        ))}
      </div>

      {visible < reviews.length && (
        <button className={styles.moreBtn} onClick={() => setVisible((v) => v + PAGE_SIZE)}>
          ดูรีวิวเพิ่มเติม ({reviews.length - visible})
        </button>
      )}
    </div>
  );
}
