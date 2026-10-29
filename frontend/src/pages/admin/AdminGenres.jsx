import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import { useAccounts } from "../../context/AccountsContext";
import { slugify } from "../../data/catalog";
import Icon from "../../components/Icon";
import { ConfirmDialog, PageHead } from "../../components/admin/AdminUi";
import styles from "../../css/pages/admin/Admin.module.css";

const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const EMPTY = { id: "", label: "" };

export default function AdminGenres() {
  const { notify } = useOutletContext();
  const { genres, countByGenre, saveGenre, moveGenre, deleteGenre } = useCatalog();
  const { logAction } = useAccounts();
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null); // null = เพิ่มใหม่
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const startEdit = (g) => {
    setEditingId(g.id);
    setForm(g);
    setError("");
  };

  const cancel = () => {
    setEditingId(null);
    setForm(EMPTY);
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    const genre = { id: form.id.trim(), label: form.label.trim() };
    if (!genre.label) return setError("กรุณากรอกชื่อแนวหนัง");
    if (!ID_RE.test(genre.id)) return setError("id ใช้ได้เฉพาะ a-z, 0-9 และ -");
    if (genres.some((g) => g.id === genre.id && g.id !== editingId)) return setError("id นี้ถูกใช้แล้ว");
    if (genres.some((g) => g.label === genre.label && g.id !== editingId)) {
      return setError("มีแนวหนังชื่อนี้แล้ว");
    }
    saveGenre(genre, editingId);
    logAction(editingId ? "แก้ไขแนวหนัง" : "เพิ่มแนวหนัง", genre.label);
    notify(editingId ? `บันทึกแนว "${genre.label}" แล้ว` : `เพิ่มแนว "${genre.label}" แล้ว`);
    cancel();
  };

  const confirmDelete = () => {
    const g = pendingDelete;
    setPendingDelete(null);
    const { error: err } = deleteGenre(g.id);
    if (err) return notify(err, { error: true });
    logAction("ลบแนวหนัง", g.label);
    notify(`ลบแนว "${g.label}" แล้ว`);
    if (editingId === g.id) cancel();
  };

  return (
    <>
      <PageHead
        title="แนวหนัง"
        desc="ลำดับในตารางนี้คือลำดับที่แสดงในแท็บหน้าแรกและตัวกรองของหน้ารายการหนัง"
      />

      <section className={`${styles.card} ${styles.spaced}`}>
        <div className={styles.cardHead}>
          <h2 className={styles.cardTitle}>{editingId ? `แก้ไขแนว “${editingId}”` : "เพิ่มแนวหนัง"}</h2>
        </div>
        <form className={`${styles.cardBody} ${styles.genreForm}`} onSubmit={submit} noValidate>
          <label className={styles.field}>
            <span className={styles.label}>ชื่อที่แสดง</span>
            <input
              className={styles.input}
              value={form.label}
              onChange={(e) =>
                setForm((f) => ({
                  label: e.target.value,
                  // เพิ่มใหม่: สร้าง id จากชื่อภาษาอังกฤษให้อัตโนมัติ
                  id: editingId || f.id !== slugify(f.label) ? f.id : slugify(e.target.value),
                }))
              }
              placeholder="เช่น สารคดี"
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>id</span>
            <input
              className={styles.input}
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase() })}
              placeholder="documentary"
            />
          </label>
          <div className={styles.inline}>
            {editingId && (
              <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={cancel}>
                ยกเลิก
              </button>
            )}
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
              {editingId ? "บันทึก" : "เพิ่มแนว"}
            </button>
          </div>
          {error && <p className={`${styles.error} ${styles.full}`}>{error}</p>}
          {editingId && (
            <p className={`${styles.hint} ${styles.full}`}>
              เปลี่ยน id แล้ว หนังที่อยู่ในแนวนี้จะถูกย้ายตามให้อัตโนมัติ
            </p>
          )}
        </form>
      </section>

      <section className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>ชื่อที่แสดง</th>
                <th>id</th>
                <th className={styles.num}>จำนวนหนัง</th>
                <th className={styles.num}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((g, i) => {
                const count = countByGenre(g.id);
                return (
                  <tr key={g.id}>
                    <td>
                      <div className={`${styles.actions} ${styles.actionsStart}`}>
                        <button
                          className={styles.iconBtn}
                          onClick={() => moveGenre(g.id, -1)}
                          disabled={i === 0}
                          aria-label={`เลื่อน ${g.label} ขึ้น`}
                        >
                          <Icon name="chevronUp" size={16} />
                        </button>
                        <button
                          className={styles.iconBtn}
                          onClick={() => moveGenre(g.id, 1)}
                          disabled={i === genres.length - 1}
                          aria-label={`เลื่อน ${g.label} ลง`}
                        >
                          <Icon name="chevronDown" size={16} />
                        </button>
                      </div>
                    </td>
                    <td className={styles.cellTitle}>{g.label}</td>
                    <td className={styles.muted}>{g.id}</td>
                    <td className={styles.num}>
                      {count > 0 ? (
                        <Link to={`/movies?genre=${g.id}`} className={styles.cardLink}>
                          {count} เรื่อง
                        </Link>
                      ) : (
                        <span className={styles.muted}>0</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.iconBtn}
                          onClick={() => startEdit(g)}
                          aria-label={`แก้ไข ${g.label}`}
                          title="แก้ไข"
                        >
                          <Icon name="edit" size={16} />
                        </button>
                        <button
                          className={`${styles.iconBtn} ${styles.iconDanger}`}
                          onClick={() => setPendingDelete(g)}
                          disabled={count > 0}
                          aria-label={`ลบ ${g.label}`}
                          title={count > 0 ? "ย้ายหนังออกจากแนวนี้ก่อนจึงจะลบได้" : "ลบ"}
                        >
                          <Icon name="trash" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmDialog
        open={!!pendingDelete}
        title={`ลบแนว "${pendingDelete?.label}"?`}
        confirmLabel="ลบแนวหนัง"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        แนวนี้จะหายจากแท็บหน้าแรกและตัวกรองทั้งหมด
      </ConfirmDialog>
    </>
  );
}
