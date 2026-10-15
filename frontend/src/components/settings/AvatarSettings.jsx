import { useRef, useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import Avatar from "../Avatar";
import Icon from "../Icon";
import styles from "../../css/components/settings/Settings.module.css";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024;

export default function AvatarSettings({ onToast }) {
  const { profile, setAvatar, removeAvatar } = useProfile();
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const readFile = (file) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError("รองรับเฉพาะไฟล์ JPG, PNG หรือ WEBP");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("ไฟล์ต้องมีขนาดไม่เกิน 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setError("");
      setConfirmRemove(false);
    };
    reader.readAsDataURL(file);
  };

  const openPicker = () => inputRef.current?.click();

  const handleSave = () => {
    setAvatar(preview);
    setPreview(null);
    onToast?.("อัปเดตรูปโปรไฟล์แล้ว");
  };

  const handleRemove = () => {
    removeAvatar();
    setConfirmRemove(false);
    onToast?.("ลบรูปโปรไฟล์แล้ว", "🗑️");
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>รูปโปรไฟล์</h2>
      <p className={styles.desc}>
        แนะนำรูปสี่เหลี่ยมจัตุรัส ขนาดอย่างน้อย 400×400px (JPG, PNG, WEBP ไม่เกิน 2MB)
      </p>

      <div className={styles.avatarRow}>
        <div className={styles.avatarPreview}>
          <Avatar src={preview || profile.avatar} size={128} />
          {preview && <span className={styles.pendingTag}>ตัวอย่าง</span>}
        </div>

        <div
          className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ""}`}
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openPicker()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            readFile(e.dataTransfer.files[0]);
          }}
        >
          <Icon name="camera" size={26} />
          <p style={{ marginTop: 8 }}>
            ลากรูปมาวางที่นี่ หรือ <strong>คลิกเพื่อเลือกไฟล์</strong>
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          hidden
          onChange={(e) => {
            readFile(e.target.files[0]);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.actions}>
        {preview ? (
          <>
            <button
              className={`${styles.btn} ${styles.btnGhost}`}
              onClick={() => setPreview(null)}
            >
              ยกเลิก
            </button>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSave}>
              บันทึกรูปนี้
            </button>
          </>
        ) : (
          <>
            {profile.avatar && (
              <button
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={() => setConfirmRemove(true)}
              >
                <Icon name="trash" size={15} />
                ลบรูป
              </button>
            )}
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={openPicker}>
              <Icon name="camera" size={15} />
              {profile.avatar ? "เปลี่ยนรูป" : "อัปโหลดรูป"}
            </button>
          </>
        )}
      </div>

      {confirmRemove && (
        <div className={styles.confirmBox} role="alertdialog">
          ต้องการลบรูปโปรไฟล์ใช่ไหม? จะกลับไปใช้รูปตั้งต้นแทน
          <div className={styles.actions}>
            <button
              className={`${styles.btn} ${styles.btnGhost}`}
              onClick={() => setConfirmRemove(false)}
            >
              ยกเลิก
            </button>
            <button
              className={`${styles.btn} ${styles.btnDangerSolid}`}
              onClick={handleRemove}
            >
              ลบรูป
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
