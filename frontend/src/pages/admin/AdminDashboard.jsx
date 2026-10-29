import { Link } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import { useAccounts } from "../../context/AccountsContext";
import useAdminData from "../../hooks/useAdminData";
import Avatar from "../../components/Avatar";
import Poster from "../../components/Poster";
import Icon from "../../components/Icon";
import { Badge, PageHead } from "../../components/admin/AdminUi";
import { roleLabel } from "../../data/accounts";
import { formatDate, timeAgo } from "../../utils/format";
import styles from "../../css/pages/admin/Admin.module.css";

function Stat({ to, icon, value, label, hint }) {
  return (
    <Link to={to} className={`${styles.card} ${styles.stat}`}>
      <span className={styles.statIcon}>
        <Icon name={icon} size={20} />
      </span>
      <span>
        <span className={styles.statValue}>{value.toLocaleString()}</span>
        <span className={styles.statLabel}>{label}</span>
        {hint && <span className={styles.statHint}>{hint}</span>}
      </span>
    </Link>
  );
}

export default function AdminDashboard() {
  const { allMovies } = useCatalog();
  const { auditLog } = useAccounts();
  const { users, reviews } = useAdminData();

  const published = allMovies.filter((m) => m.status === "published").length;
  const suspended = users.filter((u) => u.account.status === "suspended").length;
  const admins = users.filter((u) => u.account.role === "admin").length;
  const userReviews = reviews.filter((r) => r.kind === "user").length;
  const hiddenReviews = reviews.filter((r) => r.hidden).length;
  const watchlistTotal = users.reduce((s, u) => s + u.watchlistCount, 0);

  const topMovies = [...allMovies].sort((a, b) => b.reviews - a.reviews).slice(0, 5);
  const newestUsers = [...users]
    .sort((a, b) => b.account.createdAt.localeCompare(a.account.createdAt))
    .slice(0, 5);
  const latestReviews = [...reviews]
    .sort((a, b) => b.review.date.localeCompare(a.review.date))
    .slice(0, 5);

  return (
    <>
      <PageHead
        title="แดชบอร์ด"
        desc="ภาพรวมของแคตตาล็อกหนังและชุมชน PixelFilm"
        actions={
          <Link to="/admin/movies/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            <Icon name="plus" size={16} />
            เพิ่มหนัง
          </Link>
        }
      />

      <div className={`${styles.notice} ${styles.spaced}`}>
        <Icon name="alert" size={16} />
        <span>
          โหมดสาธิต: ข้อมูลทั้งหมดเก็บในเบราว์เซอร์นี้ (localStorage) และยังไม่ได้เชื่อมต่อ backend
          การตรวจสิทธิ์ผู้ดูแลในหน้าเว็บมีไว้สาธิตเท่านั้น
        </span>
      </div>

      <div className={styles.stats}>
        <Stat
          to="/admin/movies"
          icon="film"
          value={allMovies.length}
          label="หนังทั้งหมด"
          hint={`เผยแพร่ ${published} · ซ่อน ${allMovies.length - published}`}
        />
        <Stat
          to="/admin/users"
          icon="users"
          value={users.length}
          label="บัญชีผู้ใช้"
          hint={`ผู้ดูแล ${admins} · ถูกระงับ ${suspended}`}
        />
        <Stat
          to="/admin/reviews"
          icon="message"
          value={reviews.length}
          label="รีวิว"
          hint={`จากสมาชิก ${userReviews} · ซ่อนอยู่ ${hiddenReviews}`}
        />
        <Stat
          to="/admin/users"
          icon="bookmark"
          value={watchlistTotal}
          label="รายการอยากดูรวม"
          hint="นับจากทุกบัญชี"
        />
      </div>

      <div className={styles.dashGrid}>
        <div className={styles.dashCol}>
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>หนังที่มีรีวิวมากที่สุด</h2>
              <Link to="/admin/movies" className={styles.cardLink}>
                จัดการหนัง →
              </Link>
            </div>
            <ol className={styles.list}>
              {topMovies.map((m, i) => (
                <li key={m.id} className={styles.listItem}>
                  <span className={styles.rank}>{i + 1}</span>
                  <span className={styles.thumb}>
                    <Poster src={m.poster} title={m.title} />
                  </span>
                  <span className={styles.listMain}>
                    <Link to={`/admin/movies/${m.id}/edit`} className={styles.listTitle}>
                      {m.title}
                    </Link>
                    <span className={styles.listSub}>
                      {m.genreLabel} · {m.year}
                    </span>
                  </span>
                  <span className={styles.listMeta}>
                    <span className={styles.score}>★ {m.score}</span>
                    <br />
                    {m.reviews.toLocaleString()} รีวิว
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>รีวิวล่าสุด</h2>
              <Link to="/admin/reviews" className={styles.cardLink}>
                ดูทั้งหมด →
              </Link>
            </div>
            <ul className={styles.list}>
              {latestReviews.map((r) => (
                <li key={r.key} className={styles.listItem}>
                  <Avatar src={r.author.avatar} name={r.author.name} color={r.author.color} size={32} />
                  <span className={styles.listMain}>
                    <span className={styles.listTitle}>{r.review.title}</span>
                    <span className={styles.listSub}>
                      {r.author.name} · {r.movie.title}
                    </span>
                  </span>
                  <span className={styles.listMeta}>
                    <span className={styles.score}>★ {r.review.score}</span>
                    <br />
                    {formatDate(r.review.date)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className={styles.dashCol}>
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>ทางลัด</h2>
            </div>
            <div className={`${styles.cardBody} ${styles.quick}`}>
              <Link to="/admin/movies/new" className={`${styles.btn} ${styles.btnGhost}`}>
                <Icon name="plus" size={16} /> เพิ่มหนัง
              </Link>
              <Link to="/admin/users" className={`${styles.btn} ${styles.btnGhost}`}>
                <Icon name="users" size={16} /> จัดการผู้ใช้
              </Link>
              <Link to="/admin/reviews" className={`${styles.btn} ${styles.btnGhost}`}>
                <Icon name="message" size={16} /> ตรวจรีวิว
              </Link>
              <Link to="/admin/genres" className={`${styles.btn} ${styles.btnGhost}`}>
                <Icon name="tag" size={16} /> แนวหนัง
              </Link>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>บัญชีที่สมัครล่าสุด</h2>
              <Link to="/admin/users" className={styles.cardLink}>
                ดูทั้งหมด →
              </Link>
            </div>
            <ul className={styles.list}>
              {newestUsers.map((u) => (
                <li key={u.account.username} className={styles.listItem}>
                  <Avatar
                    src={u.profile.avatar}
                    name={u.name}
                    color={u.community ? u.profile.color : undefined}
                    size={32}
                  />
                  <span className={styles.listMain}>
                    <Link to={`/admin/users/${u.account.username}`} className={styles.listTitle}>
                      {u.name}
                    </Link>
                    <span className={styles.listSub}>
                      @{u.account.username} · {formatDate(u.account.createdAt)}
                    </span>
                  </span>
                  {u.account.role === "admin" ? (
                    <Badge tone="gold">{roleLabel("admin")}</Badge>
                  ) : u.account.status === "suspended" ? (
                    <Badge tone="red">ถูกระงับ</Badge>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>กิจกรรมของผู้ดูแลล่าสุด</h2>
              <Link to="/admin/activity" className={styles.cardLink}>
                ดูทั้งหมด →
              </Link>
            </div>
            {auditLog.length === 0 ? (
              <p className={`${styles.cardBody} ${styles.muted}`}>ยังไม่มีการเปลี่ยนแปลงข้อมูล</p>
            ) : (
              <ul className={styles.list}>
                {auditLog.slice(0, 6).map((e) => (
                  <li key={e.id} className={styles.listItem}>
                    <span className={styles.listMain}>
                      <span className={styles.listTitle}>
                        <span className={styles.logAction}>{e.action}</span>{" "}
                        <span className={styles.logTarget}>{e.target}</span>
                      </span>
                      <span className={styles.listSub}>
                        โดย @{e.by} · {timeAgo(e.at)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
