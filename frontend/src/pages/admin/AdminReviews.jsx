import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import { useAccounts } from "../../context/AccountsContext";
import { useProfile } from "../../context/ProfileContext";
import useAdminData from "../../hooks/useAdminData";
import usePaging from "../../hooks/usePaging";
import Avatar from "../../components/Avatar";
import Icon from "../../components/Icon";
import {
  Badge,
  ConfirmDialog,
  EmptyState,
  PageHead,
  Pager,
  SearchInput,
  Select,
} from "../../components/admin/AdminUi";
import { normalize } from "../../utils/search";
import { formatDate } from "../../utils/format";
import styles from "../../css/pages/admin/Admin.module.css";

const PAGE_SIZE = 12;

const KINDS = [
  { id: "all", label: "ทุกแหล่ง" },
  { id: "community", label: "ชุมชน" },
  { id: "user", label: "สมาชิก" },
];

const VISIBILITY = [
  { id: "all", label: "ทุกสถานะ" },
  { id: "visible", label: "แสดงอยู่" },
  { id: "hidden", label: "ถูกซ่อน" },
];

const SCORES = [
  { id: "all", label: "ทุกคะแนน" },
  { id: "low", label: "≤ 5 (วิจารณ์)" },
  { id: "mid", label: "6–8" },
  { id: "high", label: "9–10" },
];

const scoreTest = {
  all: () => true,
  low: (s) => s <= 5,
  mid: (s) => s >= 6 && s <= 8,
  high: (s) => s >= 9,
};

// สถานะที่ผู้ชมเห็นจริง: ซ่อนโดยผู้ดูแล / ผู้เขียนถูกระงับ-ลบ / หนังถูกซ่อน
function visibilityOf(r) {
  if (r.hidden) return { tone: "red", label: "ซ่อนโดยผู้ดูแล" };
  if (r.authorStatus === "suspended") return { tone: "red", label: "ผู้เขียนถูกระงับ" };
  if (r.authorStatus === "deleted") return { tone: "red", label: "บัญชีถูกลบ" };
  if (r.movie.status !== "published") return { tone: "gold", label: "หนังถูกซ่อน" };
  return { tone: "green", label: "แสดงอยู่" };
}

export default function AdminReviews() {
  const { notify } = useOutletContext();
  const { setReviewHidden } = useCatalog();
  const { logAction } = useAccounts();
  const { adminDeleteUserReview } = useProfile();
  const { reviews } = useAdminData();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [visibility, setVisibility] = useState("all");
  const [score, setScore] = useState("all");
  const [pendingDelete, setPendingDelete] = useState(null);

  const q = normalize(query);
  const filtered = reviews
    .map((r) => ({ ...r, visibility: visibilityOf(r) }))
    .filter(
      (r) =>
        !q ||
        normalize(r.review.title).includes(q) ||
        normalize(r.review.body).includes(q) ||
        normalize(r.movie.title).includes(q) ||
        normalize(r.author.name).includes(q) ||
        normalize(r.author.username).includes(q)
    )
    .filter((r) => kind === "all" || r.kind === kind)
    .filter(
      (r) =>
        visibility === "all" || (visibility === "visible") === (r.visibility.tone === "green")
    )
    .filter((r) => scoreTest[score](r.review.score))
    .sort((a, b) => b.review.date.localeCompare(a.review.date));

  const { rows, pager, reset } = usePaging(filtered, PAGE_SIZE);
  const withReset = (setter) => (v) => {
    setter(v);
    reset();
  };

  const toggleHidden = (r) => {
    setReviewHidden(r.review.id, !r.hidden);
    logAction(r.hidden ? "แสดงรีวิว" : "ซ่อนรีวิว", `"${r.review.title}"`, `${r.author.name} · ${r.movie.title}`);
    notify(r.hidden ? "แสดงรีวิวบนหน้าเว็บแล้ว" : "ซ่อนรีวิวจากหน้าเว็บแล้ว", {
      undo: () => setReviewHidden(r.review.id, r.hidden),
    });
  };

  const confirmDelete = () => {
    const r = pendingDelete;
    adminDeleteUserReview(r.author.username, r.movie.id);
    logAction("ลบรีวิว", `"${r.review.title}"`, `@${r.author.username} · ${r.movie.title}`);
    setPendingDelete(null);
    notify("ลบรีวิวแล้ว");
  };

  return (
    <>
      <PageHead
        title="รีวิว"
        desc="ตรวจสอบรีวิวทั้งหมด ซ่อนรีวิวจากชุมชนที่ไม่เหมาะสม หรือลบรีวิวของสมาชิก"
      />

      <section className={styles.card}>
        <div className={styles.toolbar}>
          <SearchInput
            value={query}
            onChange={withReset(setQuery)}
            placeholder="ค้นหาหัวข้อ, เนื้อหา, หนัง หรือผู้เขียน"
          />
          <Select label="แหล่งที่มา" value={kind} onChange={withReset(setKind)} options={KINDS} />
          <Select
            label="สถานะ"
            value={visibility}
            onChange={withReset(setVisibility)}
            options={VISIBILITY}
          />
          <Select label="คะแนน" value={score} onChange={withReset(setScore)} options={SCORES} />
          <span className={styles.resultCount}>{filtered.length} รีวิว</span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="message" text="ไม่พบรีวิวที่ตรงกับตัวกรอง" />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>รีวิว</th>
                  <th>หนัง</th>
                  <th>ผู้เขียน</th>
                  <th className={styles.num}>คะแนน</th>
                  <th>วันที่</th>
                  <th>สถานะ</th>
                  <th className={styles.num}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key} className={r.visibility.tone === "green" ? "" : styles.rowDim}>
                    <td className={styles.reviewCell}>
                      <span className={styles.reviewTitle}>
                        {r.review.title}
                        {r.review.spoiler && (
                          <>
                            {" "}
                            <Badge tone="gold" plain>
                              สปอยล์
                            </Badge>
                          </>
                        )}
                      </span>
                      <span className={styles.reviewBody}>{r.review.body}</span>
                    </td>
                    <td>
                      <Link to={`/admin/movies/${r.movie.id}/edit`} className={styles.cellTitle}>
                        {r.movie.title}
                      </Link>
                    </td>
                    <td>
                      <div className={`${styles.cellUser} ${styles.cellUserSm}`}>
                        <Avatar src={r.author.avatar} name={r.author.name} color={r.author.color} size={28} />
                        <span>
                          {r.authorStatus === "deleted" ? (
                            <span className={styles.cellTitle}>{r.author.name}</span>
                          ) : (
                            <Link to={`/admin/users/${r.author.username}`} className={styles.cellTitle}>
                              {r.author.name}
                            </Link>
                          )}
                          <span className={styles.cellSub}>
                            {r.kind === "community" ? "ชุมชน" : "สมาชิก"} · @{r.author.username}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className={`${styles.num} ${styles.score}`}>★ {r.review.score}</td>
                    <td className={styles.nowrap}>{formatDate(r.review.date)}</td>
                    <td>
                      <Badge tone={r.visibility.tone}>{r.visibility.label}</Badge>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        {r.kind === "community" ? (
                          <button
                            className={styles.iconBtn}
                            onClick={() => toggleHidden(r)}
                            title={r.hidden ? "แสดงรีวิว" : "ซ่อนรีวิว"}
                            aria-label={r.hidden ? "แสดงรีวิว" : "ซ่อนรีวิว"}
                          >
                            <Icon name={r.hidden ? "eye" : "eyeOff"} size={16} />
                          </button>
                        ) : (
                          <button
                            className={`${styles.iconBtn} ${styles.iconDanger}`}
                            onClick={() => setPendingDelete(r)}
                            title="ลบรีวิว"
                            aria-label="ลบรีวิว"
                          >
                            <Icon name="trash" size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pager {...pager} />
      </section>

      <ConfirmDialog
        open={!!pendingDelete}
        title="ลบรีวิวนี้?"
        confirmLabel="ลบรีวิว"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        รีวิว “{pendingDelete?.review.title}” ของ @{pendingDelete?.author.username} และคะแนนที่ให้หนัง{" "}
        {pendingDelete?.movie.title} จะถูกลบออกจากบัญชีของผู้ใช้
      </ConfirmDialog>
    </>
  );
}
