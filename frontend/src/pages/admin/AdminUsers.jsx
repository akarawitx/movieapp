import { useState } from "react";
import { Link } from "react-router-dom";
import { useAccounts } from "../../context/AccountsContext";
import useAdminData from "../../hooks/useAdminData";
import usePaging from "../../hooks/usePaging";
import useSort from "../../hooks/useSort";
import { ROLES, STATUSES, roleLabel, statusLabel } from "../../data/accounts";
import Avatar from "../../components/Avatar";
import Icon from "../../components/Icon";
import {
  Badge,
  EmptyState,
  PageHead,
  Pager,
  SearchInput,
  Select,
  SortHeader,
} from "../../components/admin/AdminUi";
import { normalize } from "../../utils/search";
import { formatDate, timeAgo } from "../../utils/format";
import styles from "../../css/pages/admin/Admin.module.css";

const PAGE_SIZE = 10;

const TYPES = [
  { id: "all", label: "ทุกประเภท" },
  { id: "member", label: "สมาชิก" },
  { id: "community", label: "นักรีวิวชุมชน (ข้อมูลจำลอง)" },
];

export function UserBadges({ user, me }) {
  const { account, community } = user;
  return (
    <>
      {account.role === "admin" && <Badge tone="gold">{roleLabel("admin")}</Badge>}
      <Badge tone={account.status === "active" ? "green" : "red"}>{statusLabel(account.status)}</Badge>
      {community && (
        <Badge tone="blue" plain>
          ชุมชน
        </Badge>
      )}
      {me && <Badge plain>คุณ</Badge>}
    </>
  );
}

export default function AdminUsers() {
  const { account: me } = useAccounts();
  const { users } = useAdminData();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const { sort, onSort, compare } = useSort("createdAt");

  const q = normalize(query);
  const filtered = users
    .filter(
      (u) =>
        !q ||
        normalize(u.account.username).includes(q) ||
        normalize(u.name).includes(q) ||
        normalize(u.account.email).includes(q)
    )
    .filter((u) => role === "all" || u.account.role === role)
    .filter((u) => status === "all" || u.account.status === status)
    .filter((u) => type === "all" || (type === "community") === u.community)
    .sort(
      compare((u, key) =>
        key === "name" ? u.name : key in u ? u[key] : u.account[key] ?? ""
      )
    );

  const { rows, pager, reset } = usePaging(filtered, PAGE_SIZE);
  const withReset = (setter) => (v) => {
    setter(v);
    reset();
  };

  return (
    <>
      <PageHead
        title="บัญชีผู้ใช้"
        desc="ดูข้อมูลบัญชีทั้งหมด เปลี่ยนสิทธิ์ ระงับ หรือลบบัญชี (รหัสผ่านถูกเก็บแบบ hash และไม่แสดงให้ผู้ดูแลเห็น)"
      />

      <section className={styles.card}>
        <div className={styles.toolbar}>
          <SearchInput
            value={query}
            onChange={withReset(setQuery)}
            placeholder="ค้นหาชื่อ, username หรืออีเมล"
          />
          <Select
            label="สิทธิ์"
            value={role}
            onChange={withReset(setRole)}
            options={[{ id: "all", label: "ทุกสิทธิ์" }, ...ROLES]}
          />
          <Select
            label="สถานะ"
            value={status}
            onChange={withReset(setStatus)}
            options={[{ id: "all", label: "ทุกสถานะ" }, ...STATUSES]}
          />
          <Select label="ประเภท" value={type} onChange={withReset(setType)} options={TYPES} />
          <span className={styles.resultCount}>{filtered.length} บัญชี</span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="users" text="ไม่พบบัญชีที่ตรงกับตัวกรอง" />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <SortHeader id="name" sort={sort} onSort={onSort}>
                    ผู้ใช้
                  </SortHeader>
                  <SortHeader id="email" sort={sort} onSort={onSort}>
                    อีเมล
                  </SortHeader>
                  <th>สิทธิ์ / สถานะ</th>
                  <SortHeader id="reviewCount" sort={sort} onSort={onSort} className={styles.num}>
                    รีวิว
                  </SortHeader>
                  <SortHeader id="watchlistCount" sort={sort} onSort={onSort} className={styles.num}>
                    อยากดู
                  </SortHeader>
                  <SortHeader id="createdAt" sort={sort} onSort={onSort}>
                    สมัครเมื่อ
                  </SortHeader>
                  <SortHeader id="lastLoginAt" sort={sort} onSort={onSort}>
                    เข้าใช้ล่าสุด
                  </SortHeader>
                  <th className={styles.num}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.account.username}>
                    <td>
                      <div className={styles.cellUser}>
                        <Avatar
                          src={u.profile.avatar}
                          name={u.name}
                          color={u.community ? u.profile.color : undefined}
                          size={34}
                        />
                        <span>
                          <Link to={`/admin/users/${u.account.username}`} className={styles.cellTitle}>
                            {u.name}
                          </Link>
                          <span className={styles.cellSub}>@{u.account.username}</span>
                        </span>
                      </div>
                    </td>
                    <td className={styles.nowrap}>{u.account.email}</td>
                    <td>
                      <div className={`${styles.badges} ${styles.badgesTight}`}>
                        <UserBadges user={u} me={u.account.username === me?.username} />
                      </div>
                    </td>
                    <td className={styles.num}>{u.reviewCount}</td>
                    <td className={styles.num}>{u.watchlistCount}</td>
                    <td className={styles.nowrap}>{formatDate(u.account.createdAt)}</td>
                    <td className={`${styles.nowrap} ${styles.muted}`}>
                      {u.account.lastLoginAt ? timeAgo(u.account.lastLoginAt) : "ยังไม่เคยเข้าใช้"}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link
                          to={`/admin/users/${u.account.username}`}
                          className={styles.iconBtn}
                          title="ดูและจัดการ"
                          aria-label={`จัดการบัญชี ${u.account.username}`}
                        >
                          <Icon name="settings" size={16} />
                        </Link>
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
    </>
  );
}
