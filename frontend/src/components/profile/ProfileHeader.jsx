import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar";
import Icon from "../Icon";
import { PROFILE_GENRES } from "../../data/profile";
import styles from "../../css/components/profile/ProfileHeader.module.css";

export default function ProfileHeader({ profile }) {
  const navigate = useNavigate();
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  const joined = new Date(profile.joinedAt).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
  });
  const genres = PROFILE_GENRES.filter((g) =>
    profile.favoriteGenres.includes(g.id)
  );

  return (
    <section className={styles.wrap}>
      <div className={styles.cover} />

      <div className={styles.body}>
        <button
          className={styles.avatarBtn}
          onClick={() => navigate("/settings/avatar")}
          aria-label="เปลี่ยนรูปโปรไฟล์"
        >
          <Avatar src={profile.avatar} size={120} />
          <span className={styles.avatarOverlay}>
            <Icon name="camera" size={22} />
          </span>
        </button>

        <div className={styles.info}>
          <div className={styles.titleRow}>
            <div>
              <h1 className={styles.name}>{fullName || profile.username}</h1>
              <p className={styles.username}>@{profile.username}</p>
            </div>
            <button
              className={styles.editBtn}
              onClick={() => navigate("/settings/profile")}
            >
              <Icon name="edit" size={15} />
              แก้ไขโปรไฟล์
            </button>
          </div>

          {profile.bio && <p className={styles.bio}>{profile.bio}</p>}

          <ul className={styles.meta}>
            {profile.location && (
              <li>
                <Icon name="pin" size={15} />
                {profile.location}
              </li>
            )}
            <li>
              <Icon name="calendar" size={15} />
              เข้าร่วมเมื่อ {joined}
            </li>
            <li>
              <Icon name={profile.privacy.publicProfile ? "eye" : "lock"} size={15} />
              {profile.privacy.publicProfile ? "โปรไฟล์สาธารณะ" : "โปรไฟล์ส่วนตัว"}
            </li>
          </ul>

          {genres.length > 0 && (
            <div className={styles.genres}>
              {genres.map((g) => (
                <span key={g.id} className={styles.genre}>
                  {g.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
