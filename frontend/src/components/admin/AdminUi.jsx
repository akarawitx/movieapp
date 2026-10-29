import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "../Icon";
import styles from "../../css/pages/admin/Admin.module.css";

// หัวหน้าของแต่ละหน้าในส่วนผู้ดูแล
export function PageHead({ title, desc, back, actions }) {
  return (
    <>
      {back && (
        <Link to={back.to} className={styles.backLink}>
          <Icon name="arrowLeft" size={15} />
          {back.label}
        </Link>
      )}
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>{title}</h1>
          {desc && <p className={styles.pageDesc}>{desc}</p>}
        </div>
        {actions && <div className={styles.headActions}>{actions}</div>}
      </div>
    </>
  );
}

const TONES = {
  green: styles.badgeGreen,
  red: styles.badgeRed,
  gold: styles.badgeGold,
  blue: styles.badgeBlue,
};

export function Badge({ tone, plain = false, children }) {
  return (
    <span className={`${styles.badge} ${TONES[tone] ?? ""} ${plain ? styles.badgePlain : ""}`}>
      {children}
    </span>
  );
}

export function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className={styles.searchWrap}>
      <Icon name="search" size={16} />
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}

export function Select({ value, onChange, options, label }) {
  return (
    <select
      className={styles.select}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
    >
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Switch({ on, onChange, labelOn, labelOff, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      className={`${styles.switch} ${on ? styles.switchOn : ""}`}
      onClick={() => onChange(!on)}
    >
      <span className={styles.switchTrack} />
      {on ? labelOn : labelOff}
    </button>
  );
}

// ปุ่มหัวตารางที่กดเรียงลำดับได้
export function SortHeader({ id, sort, onSort, children, className }) {
  const active = sort.key === id;
  return (
    <th className={className} aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
      <button
        type="button"
        className={`${styles.sortBtn} ${active ? styles.sortActive : ""}`}
        onClick={() => onSort(id)}
      >
        {children}
        {active && <Icon name={sort.dir === 1 ? "chevronUp" : "chevronDown"} size={13} />}
      </button>
    </th>
  );
}

export function Pager({ page, pages, total, from, to, onPage }) {
  if (total === 0) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1
  );
  return (
    <div className={styles.pager}>
      <span>
        แสดง {from}–{to} จาก {total.toLocaleString()} รายการ
      </span>
      {pages > 1 && (
        <div className={styles.pagerBtns}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onPage(page - 1)}
            disabled={page === 1}
            aria-label="หน้าก่อนหน้า"
          >
            <Icon name="chevronLeft" size={16} />
          </button>
          {nums.map((n, i) => (
            <Fragment key={n}>
              {i > 0 && n - nums[i - 1] > 1 && <span className={styles.muted}>…</span>}
              <button
                type="button"
                className={`${styles.pageNum} ${n === page ? styles.pageNumActive : ""}`}
                onClick={() => onPage(n)}
                aria-current={n === page ? "page" : undefined}
              >
                {n}
              </button>
            </Fragment>
          ))}
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onPage(page + 1)}
            disabled={page === pages}
            aria-label="หน้าถัดไป"
          >
            <Icon name="chevronRight" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export function EmptyState({ icon = "search", text, action }) {
  return (
    <div className={styles.empty}>
      <Icon name={icon} size={34} />
      <p>{text}</p>
      {action}
    </div>
  );
}

// กล่องยืนยันก่อนทำสิ่งที่ย้อนกลับยาก (ลบ, ระงับ)
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = "ยืนยัน",
  tone = "danger",
  icon = "trash",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className={styles.dialog} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <span className={`${styles.dialogIcon} ${tone === "danger" ? "" : styles.dialogIconGold}`}>
          <Icon name={icon} size={22} />
        </span>
        <h2 id="confirm-title" className={styles.dialogTitle}>
          {title}
        </h2>
        <div className={styles.dialogBody}>{children}</div>
        <div className={styles.dialogActions}>
          <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={onCancel} autoFocus>
            ยกเลิก
          </button>
          <button
            type="button"
            className={`${styles.btn} ${tone === "danger" ? styles.btnDanger : styles.btnPrimary}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
