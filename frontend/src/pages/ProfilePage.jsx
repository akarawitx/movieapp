import { Link } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileActivityTabs from "../components/profile/ProfileActivityTabs";
import Icon from "../components/Icon";
import styles from "../css/pages/ProfilePage.module.css";

export default function ProfilePage() {
  const { profile, activity } = useProfile();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <ProfileHeader profile={profile} />
        <Link to={`/u/${profile.username}`} className={styles.publicLink}>
          <Icon name="eye" size={15} />
          ดูโปรไฟล์ในมุมมองที่ผู้อื่นเห็น
        </Link>
        <ProfileStats activity={activity} />

        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>ข้อมูลบัญชี</h2>
            <span className={styles.private}>
              <Icon name="lock" size={13} />
              เห็นเฉพาะคุณ
            </span>
          </div>
          <dl className={styles.infoGrid}>
            <div>
              <dt>ชื่อ</dt>
              <dd>{profile.firstName}</dd>
            </div>
            <div>
              <dt>นามสกุล</dt>
              <dd>{profile.lastName}</dd>
            </div>
            <div>
              <dt>ชื่อผู้ใช้</dt>
              <dd>@{profile.username}</dd>
            </div>
            <div>
              <dt>อีเมล</dt>
              <dd>{profile.email}</dd>
            </div>
          </dl>
        </section>

        <ProfileActivityTabs activity={activity} />
      </div>
    </div>
  );
}
