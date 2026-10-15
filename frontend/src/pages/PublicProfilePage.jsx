import { Link, useParams } from "react-router-dom";
import { MOVIES } from "../data/movies";
import { getAllReviews, getReviewer } from "../data/movieDetails";
import { useProfile } from "../context/ProfileContext";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileActivityTabs from "../components/profile/ProfileActivityTabs";
import Icon from "../components/Icon";
import NotFoundPage from "./NotFoundPage";
import styles from "../css/pages/PublicProfilePage.module.css";

const SPOILER_NOTE = "รีวิวนี้มีสปอยล์ — อ่านได้ในหน้ารายละเอียดหนัง";

// สร้างโปรไฟล์ + กิจกรรมของนักรีวิวจำลองจากรีวิวทั้งหมดในระบบ
function buildReviewerProfile(reviewer) {
  const mine = getAllReviews(MOVIES).filter(({ review }) => review.username === reviewer.username);
  return {
    profile: {
      firstName: reviewer.name,
      lastName: "",
      username: reviewer.username,
      bio: reviewer.bio,
      location: reviewer.location,
      joinedAt: reviewer.joinedAt,
      avatar: null,
      color: reviewer.color,
      favoriteGenres: reviewer.favoriteGenres,
      privacy: { publicProfile: true, showWatchlist: false },
    },
    activity: {
      reviews: mine
        .map(({ movie, review }) => ({
          id: review.id,
          movieId: movie.id,
          score: review.score,
          title: review.title,
          body: review.spoiler ? SPOILER_NOTE : review.body,
          date: review.date,
        }))
        .sort((a, b) => b.date.localeCompare(a.date)),
      ratings: mine.map(({ movie, review }) => ({ movieId: movie.id, score: review.score })),
      watchlist: [],
    },
    likes: mine.reduce((sum, { review }) => sum + review.likes, 0),
  };
}

export default function PublicProfilePage({ user }) {
  const { username } = useParams();
  const { profile: myProfile, activity: myActivity } = useProfile();

  const isMe = !!user && myProfile?.username === username;
  const reviewer = isMe ? null : getReviewer(username);
  if (!isMe && !reviewer) return <NotFoundPage />;

  const data = isMe
    ? { profile: myProfile, activity: myActivity, likes: null }
    : buildReviewerProfile(reviewer);
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
