import { useState } from "react";
import { useAccounts } from "../../context/AccountsContext";
import usePaging from "../../hooks/usePaging";
import { EmptyState, PageHead, Pager, SearchInput } from "../../components/admin/AdminUi";
import { normalize } from "../../utils/search";
import { formatDateTime, timeAgo } from "../../utils/format";
import styles from "../../css/pages/admin/Admin.module.css";

// บันทึกการกระทำของผู้ดูแล (เก็บล่าสุด 200 รายการ)
export default function AdminActivity() {
  const { auditLog } = useAccounts();
  const [query, setQuery] = useState("");
  const q = normalize(query);
  const filtered = auditLog.filter(
    (e) =>
      !q ||
      normalize(e.action).includes(q) ||
      normalize(e.target).includes(q) ||
      normalize(e.detail).includes(q) ||
      normalize(e.by).includes(q)
  );
  const { rows, pager, reset } = usePaging(filtered, 20);

  return (
    <>
      <PageHead
        title="บันทึกกิจกรรม"
        desc="ประวัติการเพิ่ม แก้ไข ลบ และเปลี่ยนสถานะข้อมูลโดยผู้ดูแลระบบ"
      />
      <section className={styles.card}>
        <div className={styles.toolbar}>
          <SearchInput
            value={query}
            onChange={(v) => {
              setQuery(v);
              reset();
            }}
            placeholder="ค้นหาการกระทำ, เป้าหมาย หรือผู้ทำ"
          />
          <span className={styles.resultCount}>{filtered.length} รายการ</span>
        </div>
        {filtered.length === 0 ? (
          <EmptyState
            icon="history"
            text={auditLog.length ? "ไม่พบรายการที่ตรงกับคำค้น" : "ยังไม่มีการเปลี่ยนแปลงข้อมูล"}
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>เวลา</th>
                  <th>การกระทำ</th>
                  <th>เป้าหมาย</th>
                  <th>รายละเอียด</th>
                  <th>โดย</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e.id}>
                    <td className={styles.nowrap}>
                      {formatDateTime(e.at)}
                      <span className={styles.cellSub}>{timeAgo(e.at)}</span>
                    </td>
                    <td className={`${styles.nowrap} ${styles.logAction}`}>{e.action}</td>
                    <td className={styles.logTarget}>{e.target}</td>
                    <td className={styles.muted}>{e.detail || "–"}</td>
                    <td className={styles.nowrap}>@{e.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pager {...pager} />
      </section>
    </>
  );
}
