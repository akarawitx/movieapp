import { Link, useParams } from "react-router-dom";
import { getReviewer } from "../data/movieDetails";
import { useProfile } from "../context/ProfileContext";
import { useAccounts } from "../context/AccountsContext";
import useCommunityReviews, { buildReviewerProfile } from "../hooks/useCommunityReviews";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileActivityTabs from "../components/profile/ProfileActivityTabs";
import Icon from "../components/Icon";
import NotFoundPage from "./NotFoundPage";
import styles from "../css/pages/PublicProfilePage.module.css";

export default function PublicProfilePage({ user }) {
  const { username } = useParams();
  const { profile: myProfile, activity: myActivity } = useProfile();
  const { accounts } = useAccounts();
  const { all } = useCommunityReviews();

  const isMe = !!user && myProfile?.username === username;
  // นักรีวิวที่ถูกระงับหรือลบบัญชีแล้ว → ไม่แสดงโปรไฟล์
  const reviewer =
    isMe || accounts[username]?.status !== "active" ? null : getReviewer(username);
  if (!isMe && !reviewer) return <NotFoundPage />;

  const data = isMe
    ? { profile: myProfile, activity: myActivity, likes: null }
    : buildReviewerProfile(reviewer, all);
  const { profile, activity } = data;
  const isPrivate = !profile.privacy.publicProfile;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {isMe && (
          <div className={styles.banner}>
            <Icon name="eye" size={18} />
            <span>
              {isPrivate
                ? "โปรไฟล์ของคุณตั้งเป็นส่วนตัว ผู้อื่นจะเห็นเพียงชื่อและรูปโปรไฟล์"
                : "นี่คือหน้าตาโปรไฟล์ของคุณที่ผู้ใช้คนอื่นเห็น"}
            </span>
            <Link to="/settings/preferences">ตั้งค่าความเป็นส่วนตัว</Link>
          </div>
        )}

        <ProfileHeader
          profile={profile}
          readOnly
          action={
            isMe ? (
              <Link to="/profile" className={styles.backBtn}>
                กลับไปโปรไฟล์ของฉัน
              </Link>
            ) : null
          }
        />

        {isPrivate && !isMe ? (
          <div className={styles.private}>
            <Icon name="lock" size={28} />
            <p>โปรไฟล์นี้เป็นส่วนตัว</p>
          </div>
        ) : (
          <>
            <ProfileStats activity={activity} likes={data.likes ?? undefined} />
            <ProfileActivityTabs
              activity={activity}
              readOnly
              hideWatchlist={!profile.privacy.showWatchlist}
            />
          </>
        )}
      </div>
    </div>
  );
}
