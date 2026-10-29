import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import { useAccounts } from "../../context/AccountsContext";
import useAdminData from "../../hooks/useAdminData";
import usePaging from "../../hooks/usePaging";
import useSort from "../../hooks/useSort";
import { getMovieReviews } from "../../data/movieDetails";
import { MOVIE_STATUSES } from "../../data/catalog";
import Poster from "../../components/Poster";
import Icon from "../../components/Icon";
import {
  ConfirmDialog,
  EmptyState,
  PageHead,
  Pager,
  SearchInput,
  Select,
  SortHeader,
  Switch,
} from "../../components/admin/AdminUi";
import { normalize } from "../../utils/search";
import { formatDate } from "../../utils/format";
import styles from "../../css/pages/admin/Admin.module.css";

const PAGE_SIZE = 10;

export default function AdminMovies() {
  const { notify } = useOutletContext();
  const { allMovies, genres, updateMovie, deleteMovie, restoreMovie, resetCatalog } = useCatalog();
  const { logAction } = useAccounts();
  const { users } = useAdminData();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");
  const [status, setStatus] = useState("all");
  const [year, setYear] = useState("all");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const { sort, onSort, compare } = useSort("updatedAt");

  const years = [...new Set(allMovies.map((m) => m.year))].sort((a, b) => b - a);
  const q = normalize(query);
  const filtered = allMovies
    .filter(
      (m) =>
        !q ||
        normalize(m.title).includes(q) ||
        normalize(m.id).includes(q) ||
        normalize(m.director).includes(q)
    )
    .filter((m) => genre === "all" || m.genre === genre)
    .filter((m) => status === "all" || m.status === status)
    .filter((m) => year === "all" || String(m.year) === year)
    .sort(compare((m, key) => m[key]));

  const { rows, pager, reset } = usePaging(filtered, PAGE_SIZE);
  const withReset = (setter) => (v) => {
    setter(v);
    reset();
  };

  // ผลกระทบก่อนลบ: ผู้ใช้กี่คนมีหนังเรื่องนี้ในรายการ/รีวิว
  const impactOf = (movie) => ({
    watchlists: users.filter((u) => u.activity.watchlist.includes(movie.id)).length,
    userReviews: users.filter(
      (u) => !u.community && u.activity.reviews.some((r) => r.movieId === movie.id)
    ).length,
    community: getMovieReviews(movie).length,
  });

  const toggleStatus = (movie) => {
    const next = movie.status === "published" ? "hidden" : "published";
    updateMovie(movie.id, { status: next });
    logAction(next === "published" ? "เผยแพร่หนัง" : "ซ่อนหนัง", movie.title);
    notify(next === "published" ? `เผยแพร่ "${movie.title}" แล้ว` : `ซ่อน "${movie.title}" จากหน้าเว็บแล้ว`);
  };

  const confirmDelete = () => {
    const movie = pendingDelete;
    const { movie: removed, index } = deleteMovie(movie.id);
    logAction("ลบหนัง", movie.title);
    setPendingDelete(null);
    notify(`ลบ "${movie.title}" แล้ว`, {
      undo: () => {
        restoreMovie(removed, index);
        logAction("กู้คืนหนัง", movie.title);
      },
    });
  };

  const impact = pendingDelete ? impactOf(pendingDelete) : null;

  return (
    <>
      <PageHead
        title="หนังทั้งหมด"
        desc="เพิ่ม แก้ไข ซ่อน หรือลบหนังในแคตตาล็อก การเปลี่ยนแปลงจะแสดงบนหน้าเว็บทันที"
        actions={
          <>
            <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => setConfirmReset(true)}>
              <Icon name="refresh" size={15} />
              คืนค่าเริ่มต้น
            </button>
            <Link to="/admin/movies/new" className={`${styles.btn} ${styles.btnPrimary}`}>
              <Icon name="plus" size={16} />
              เพิ่มหนัง
            </Link>
          </>
        }
      />

      <section className={styles.card}>
        <div className={styles.toolbar}>
          <SearchInput
            value={query}
            onChange={withReset(setQuery)}
            placeholder="ค้นหาชื่อเรื่อง, id หรือผู้กำกับ"
          />
          <Select
            label="แนวหนัง"
            value={genre}
            onChange={withReset(setGenre)}
            options={[{ id: "all", label: "ทุกแนว" }, ...genres]}
          />
          <Select
            label="ปี"
            value={year}
            onChange={withReset(setYear)}
            options={[{ id: "all", label: "ทุกปี" }, ...years.map((y) => ({ id: String(y), label: y }))]}
          />
          <Select
            label="สถานะ"
            value={status}
            onChange={withReset(setStatus)}
            options={[{ id: "all", label: "ทุกสถานะ" }, ...MOVIE_STATUSES]}
          />
          <span className={styles.resultCount}>{filtered.length} เรื่อง</span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="film"
            text={allMovies.length ? "ไม่พบหนังที่ตรงกับตัวกรอง" : "ยังไม่มีหนังในแคตตาล็อก"}
            action={
              <Link to="/admin/movies/new" className={`${styles.btn} ${styles.btnPrimary}`}>
                เพิ่มหนังเรื่องแรก
              </Link>
            }
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <SortHeader id="title" sort={sort} onSort={onSort}>
                    หนัง
                  </SortHeader>
                  <th>แนว</th>
                  <SortHeader id="releaseDate" sort={sort} onSort={onSort}>
                    วันฉาย
                  </SortHeader>
                  <SortHeader id="score" sort={sort} onSort={onSort} className={styles.num}>
                    คะแนน
                  </SortHeader>
                  <SortHeader id="reviews" sort={sort} onSort={onSort} className={styles.num}>
                    รีวิว
                  </SortHeader>
                  <th>สถานะ</th>
                  <SortHeader id="updatedAt" sort={sort} onSort={onSort}>
                    แก้ไขล่าสุด
                  </SortHeader>
                  <th className={styles.num}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div className={styles.cellMovie}>
                        <span className={styles.thumb}>
                          <Poster src={m.poster} title={m.title} />
                        </span>
                        <span>
                          <Link to={`/admin/movies/${m.id}/edit`} className={styles.cellTitle}>
                            {m.title}
                          </Link>
                          <span className={styles.cellSub}>
                            {m.year} · {m.duration} · id: {m.id}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className={styles.nowrap}>{m.genreLabel}</td>
                    <td className={styles.nowrap}>{formatDate(m.releaseDate)}</td>
                    <td className={`${styles.num} ${styles.score}`}>★ {m.score}</td>
                    <td className={styles.num}>{m.reviews.toLocaleString()}</td>
                    <td>
                      <Switch
                        on={m.status === "published"}
                        onChange={() => toggleStatus(m)}
                        labelOn="เผยแพร่"
                        labelOff="ซ่อน"
                      />
                    </td>
                    <td className={`${styles.nowrap} ${styles.muted}`}>{formatDate(m.updatedAt)}</td>
                    <td>
                      <div className={styles.actions}>
                        <Link
                          to={`/movies/${m.id}`}
                          className={styles.iconBtn}
                          title="ดูบนหน้าเว็บ"
                          aria-label={`ดู ${m.title} บนหน้าเว็บ`}
                        >
                          <Icon name="eye" size={16} />
                        </Link>
                        <Link
                          to={`/admin/movies/${m.id}/edit`}
                          className={styles.iconBtn}
                          title="แก้ไข"
                          aria-label={`แก้ไข ${m.title}`}
                        >
                          <Icon name="edit" size={16} />
                        </Link>
                        <button
                          className={`${styles.iconBtn} ${styles.iconDanger}`}
                          onClick={() => setPendingDelete(m)}
                          title="ลบ"
                          aria-label={`ลบ ${m.title}`}
                        >
                          <Icon name="trash" size={16} />
                        </button>
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
        title={`ลบ "${pendingDelete?.title}"?`}
        confirmLabel="ลบหนัง"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        หนังเรื่องนี้จะหายจากหน้าเว็บทั้งหมดทันที
        {impact && (
          <ul>
            <li>อยู่ในรายการอยากดูของผู้ใช้ {impact.watchlists} คน</li>
            <li>มีรีวิวจากสมาชิก {impact.userReviews} คน และรีวิวจากชุมชน {impact.community} รีวิว</li>
          </ul>
        )}
        <p className={styles.dialogNote}>หากต้องการเก็บข้อมูลไว้ แนะนำให้ "ซ่อน" แทนการลบ</p>
      </ConfirmDialog>

      <ConfirmDialog
        open={confirmReset}
        title="คืนค่าแคตตาล็อกเริ่มต้น?"
        icon="refresh"
        confirmLabel="คืนค่าเริ่มต้น"
        onConfirm={() => {
          resetCatalog();
          logAction("คืนค่าแคตตาล็อกเริ่มต้น", "หนังและแนวหนังทั้งหมด");
          setConfirmReset(false);
          notify("คืนค่าแคตตาล็อกเริ่มต้นแล้ว");
        }}
        onCancel={() => setConfirmReset(false)}
      >
        หนัง แนวหนัง และรีวิวที่ซ่อนไว้ จะกลับเป็นข้อมูลชุดแรกของระบบ การแก้ไขทั้งหมดจะหายไป
        (บัญชีผู้ใช้ไม่ได้รับผลกระทบ)
      </ConfirmDialog>
    </>
  );
}
