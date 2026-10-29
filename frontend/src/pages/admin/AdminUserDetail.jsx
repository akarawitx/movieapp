import { useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useAccounts } from "../../context/AccountsContext";
import { useProfile } from "../../context/ProfileContext";
import { useCatalog } from "../../context/CatalogContext";
import useAdminData from "../../hooks/useAdminData";
import { ROLES, roleLabel } from "../../data/accounts";
import Avatar from "../../components/Avatar";
import Icon from "../../components/Icon";
import ProfileActivityTabs from "../../components/profile/ProfileActivityTabs";
import { ConfirmDialog, EmptyState, PageHead } from "../../components/admin/AdminUi";
import { UserBadges } from "./AdminUsers";
import { formatDate, formatDateTime } from "../../utils/format";
import styles from "../../css/pages/admin/Admin.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ProfileEditor({ user, onSave, onCancel }) {
  const { profile } = user;
  const [form, setForm] = useState({
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    email: user.account.email ?? "",
    location: profile.location ?? "",
    bio: profile.bio ?? "",
  });
  const [error, setError] = useState("");
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.firstName.trim()) return setError("กรุณากรอกชื่อ");
    if (!EMAIL_RE.test(form.email.trim())) return setError("รูปแบบอีเมลไม่ถูกต้อง");
    onSave({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      location: form.location.trim(),
      bio: form.bio.trim(),
    });
  };

  return (
    <form onSubmit={submit} noValidate className={styles.fields}>
      <label className={styles.field}>
        <span className={styles.label}>ชื่อ</span>
        <input className={styles.input} value={form.firstName} onChange={set("firstName")} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>นามสกุล</span>
        <input className={styles.input} value={form.lastName} onChange={set("lastName")} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>อีเมล</span>
        <input type="email" className={styles.input} value={form.email} onChange={set("email")} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>ที่อยู่</span>
        <input className={styles.input} value={form.location} onChange={set("location")} />
      </label>
      <label className={`${styles.field} ${styles.full}`}>
        <span className={styles.label}>แนะนำตัว</span>
        <textarea className={styles.textarea} value={form.bio} onChange={set("bio")} rows={3} />
      </label>
      {error && <p className={`${styles.error} ${styles.full}`}>{error}</p>}
      <div className={`${styles.formFooter} ${styles.full}`}>
        <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={onCancel}>
          ยกเลิก
        </button>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
          บันทึก
        </button>
      </div>
    </form>
  );
}

export default function AdminUserDetail() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { notify } = useOutletContext();
  const { account: me, setRole, setStatus, resetPassword, deleteAccountAsAdmin, logAction } =
    useAccounts();
  const { adminUpdateProfile, adminDeleteUserData } = useProfile();
  const { genres } = useCatalog();
  const { users } = useAdminData();
  const [editing, setEditing] = useState(false);
  const [tempPassword, setTempPassword] = useState(null);
  const [confirm, setConfirm] = useState(null); // "suspend" | "delete"

  const user = users.find((u) => u.account.username === username);
  const [role, setRoleDraft] = useState(user?.account.role ?? "user");

  if (!user) {
    return (
      <>
        <PageHead title="ไม่พบบัญชี" back={{ to: "/admin/users", label: "กลับไปรายการบัญชี" }} />
        <section className={styles.card}>
          <EmptyState
            icon="users"
            text={`ไม่มีบัญชี @${username} ในระบบ อาจถูกลบไปแล้ว`}
            action={
              <Link to="/admin/users" className={`${styles.btn} ${styles.btnPrimary}`}>
                ดูบัญชีทั้งหมด
              </Link>
            }
          />
        </section>
      </>
    );
  }

  const { account, profile, activity, community } = user;
  const isMe = account.username === me?.username;
  const suspended = account.status === "suspended";

  // ทุกการกระทำคืน { error } ถ้าไม่ผ่านเงื่อนไขกันพลาด
  const run = (result, okMsg, action, detail) => {
    if (result.error) {
      notify(result.error, { error: true });
      return false;
    }
    logAction(action, `@${account.username}`, detail);
    notify(okMsg);
    return true;
  };

  const saveRole = () =>
    run(setRole(account.username, role), `เปลี่ยนสิทธิ์เป็น "${roleLabel(role)}" แล้ว`, "เปลี่ยนสิทธิ์", roleLabel(role));

  const toggleSuspend = () => {
    const next = suspended ? "active" : "suspended";
    run(
      setStatus(account.username, next),
      suspended ? "ยกเลิกการระงับบัญชีแล้ว" : "ระงับบัญชีแล้ว",
      suspended ? "ยกเลิกระงับบัญชี" : "ระงับบัญชี"
    );
    setConfirm(null);
  };

  const handleReset = () => {
    const result = resetPassword(account.username);
    if (run(result, "สร้างรหัสผ่านชั่วคราวแล้ว", "รีเซ็ตรหัสผ่าน")) setTempPassword(result.password);
  };

  const handleDelete = () => {
    const result = deleteAccountAsAdmin(account.username);
    setConfirm(null);
    if (!run(result, `ลบบัญชี @${account.username} แล้ว`, "ลบบัญชี")) return;
    adminDeleteUserData(account.username);
    navigate("/admin/users");
  };

  const saveProfile = (patch) => {
    adminUpdateProfile(account.username, patch);
    logAction("แก้ไขโปรไฟล์", `@${account.username}`);
    notify("บันทึกข้อมูลโปรไฟล์แล้ว");
    setEditing(false);
  };

  const favorite = (profile.favoriteGenres ?? [])
    .map((id) => genres.find((g) => g.id === id)?.label ?? id)
    .join(", ");

  return (
    <>
      <PageHead
        title={user.name}
        desc={`@${account.username}`}
        back={{ to: "/admin/users", label: "กลับไปรายการบัญชี" }}
        actions={
          community && !suspended ? (
            <Link to={`/u/${account.username}`} className={`${styles.btn} ${styles.btnGhost}`}>
              <Icon name="external" size={15} />
              ดูโปรไฟล์สาธารณะ
            </Link>
          ) : null
        }
      />

      <div className={styles.formGrid}>
        <div className={styles.formMain}>
          <section className={`${styles.card} ${styles.userHero}`}>
            <Avatar
              src={profile.avatar}
              name={user.name}
              color={community ? profile.color : undefined}
              size={72}
            />
            <div className={styles.userHeroText}>
              <h2 className={styles.userName}>{user.name}</h2>
              <p className={styles.userHandle}>
                @{account.username} · {account.email}
              </p>
              <div className={styles.badges}>
                <UserBadges user={user} me={isMe} />
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>ข้อมูลบัญชี</h2>
              {!community && !editing && (
                <button className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => setEditing(true)}>
                  <Icon name="edit" size={14} />
                  แก้ไขโปรไฟล์
                </button>
              )}
            </div>
            <div className={styles.cardBody}>
              {editing ? (
                <ProfileEditor user={user} onSave={saveProfile} onCancel={() => setEditing(false)} />
              ) : (
                <dl className={styles.dl}>
                  <dt>ชื่อผู้ใช้</dt>
                  <dd>@{account.username}</dd>
                  <dt>อีเมล</dt>
                  <dd>{account.email}</dd>
                  <dt>สิทธิ์</dt>
                  <dd>{roleLabel(account.role)}</dd>
                  <dt>รหัสผ่าน</dt>
                  <dd>{account.passwordHash ? "ตั้งแล้ว (เก็บแบบ hash ไม่แสดงให้เห็น)" : "ยังไม่ได้ตั้ง"}</dd>
                  <dt>สมัครเมื่อ</dt>
                  <dd>{formatDate(account.createdAt)}</dd>
                  <dt>เข้าใช้ล่าสุด</dt>
                  <dd>{account.lastLoginAt ? formatDateTime(account.lastLoginAt) : "ยังไม่เคยเข้าใช้"}</dd>
                  <dt>ที่อยู่</dt>
                  <dd>{profile.location || "–"}</dd>
                  <dt>แนวที่ชอบ</dt>
                  <dd>{favorite || "–"}</dd>
                  <dt>แนะนำตัว</dt>
                  <dd>{profile.bio || "–"}</dd>
                  <dt>ความเป็นส่วนตัว</dt>
                  <dd>
                    {profile.privacy?.publicProfile ? "โปรไฟล์สาธารณะ" : "โปรไฟล์ส่วนตัว"}
                    {" · "}
                    {profile.privacy?.showWatchlist ? "แสดงรายการอยากดู" : "ซ่อนรายการอยากดู"}
                  </dd>
                </dl>
              )}
              {community && (
                <p className={`${styles.hint} ${styles.spacedTop}`}>
                  บัญชีนักรีวิวชุมชนเป็นข้อมูลจำลอง โปรไฟล์และรีวิวสร้างจากข้อมูลตั้งต้น จึงแก้ไขโปรไฟล์ไม่ได้
                  แต่จัดการสิทธิ์ ระงับ หรือลบบัญชีได้ตามปกติ
                </p>
              )}
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>กิจกรรม</h2>
              <span className={styles.muted}>
                {user.reviewCount} รีวิว · {user.watchlistCount} อยากดู
              </span>
            </div>
            <div className={styles.cardBody}>
              <ProfileActivityTabs activity={activity} readOnly includeHidden />
            </div>
          </section>
        </div>

        <aside className={styles.formSide}>
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>การจัดการ</h2>
            </div>
            <div className={`${styles.cardBody} ${styles.actionList}`}>
              {isMe && (
                <div className={styles.notice}>
                  <Icon name="alert" size={16} />
                  <span>
                    นี่คือบัญชีของคุณ เปลี่ยนสิทธิ์ ระงับ หรือลบจากหน้านี้ไม่ได้ (แก้ข้อมูลตัวเองได้ที่{" "}
                    <Link to="/settings/profile">ตั้งค่า</Link>)
                  </span>
                </div>
              )}

              <label className={styles.field}>
                <span className={styles.label}>สิทธิ์การใช้งาน</span>
                <div className={styles.inline}>
                  <select
                    className={styles.select}
                    value={role}
                    onChange={(e) => setRoleDraft(e.target.value)}
                    disabled={isMe}
                  >
                    {ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <button
                    className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
                    onClick={saveRole}
                    disabled={isMe || role === account.role}
                  >
                    บันทึก
                  </button>
                </div>
              </label>

              <button
                className={`${styles.btn} ${styles.btnGhost}`}
                onClick={handleReset}
                disabled={isMe}
              >
                <Icon name="key" size={16} />
                รีเซ็ตรหัสผ่าน
              </button>
              {tempPassword && (
                <div>
                  <span className={styles.hint}>
                    รหัสผ่านชั่วคราว (แสดงครั้งเดียว ส่งให้ผู้ใช้แล้วให้เปลี่ยนหลังเข้าสู่ระบบ)
                  </span>
                  <div className={styles.tempPw}>
                    <code>{tempPassword}</code>
                    <button
                      className={styles.iconBtn}
                      aria-label="คัดลอกรหัสผ่านชั่วคราว"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(tempPassword);
                          notify("คัดลอกแล้ว");
                        } catch {
                          notify("คัดลอกไม่สำเร็จ", { error: true });
                        }
                      }}
                    >
                      <Icon name="check" size={15} />
                    </button>
                  </div>
                </div>
              )}

              <button
                className={`${styles.btn} ${suspended ? styles.btnGhost : styles.btnDanger}`}
                onClick={() => (suspended ? toggleSuspend() : setConfirm("suspend"))}
                disabled={isMe}
              >
                <Icon name={suspended ? "check" : "ban"} size={16} />
                {suspended ? "ยกเลิกการระงับบัญชี" : "ระงับบัญชี"}
              </button>
              <button
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={() => setConfirm("delete")}
                disabled={isMe}
              >
                <Icon name="trash" size={16} />
                ลบบัญชี
              </button>
            </div>
          </section>
        </aside>
      </div>

      <ConfirmDialog
        open={confirm === "suspend"}
        title={`ระงับบัญชี @${account.username}?`}
        icon="ban"
        confirmLabel="ระงับบัญชี"
        onConfirm={toggleSuspend}
        onCancel={() => setConfirm(null)}
      >
        ผู้ใช้จะเข้าสู่ระบบไม่ได้ และรีวิวของผู้ใช้จะถูกซ่อนจากหน้าเว็บจนกว่าจะยกเลิกการระงับ
      </ConfirmDialog>

      <ConfirmDialog
        open={confirm === "delete"}
        title={`ลบบัญชี @${account.username}?`}
        confirmLabel="ลบบัญชีถาวร"
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      >
        โปรไฟล์ รายการอยากดู รีวิว และคะแนนทั้งหมดของบัญชีนี้จะถูกลบ <strong>และย้อนกลับไม่ได้</strong>
        {!community && " หากเพียงต้องการหยุดการใช้งานชั่วคราว แนะนำให้ระงับบัญชีแทน"}
      </ConfirmDialog>
    </>
  );
}
