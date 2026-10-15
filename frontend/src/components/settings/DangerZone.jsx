import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";
import Icon from "../Icon";
import styles from "../../css/components/settings/Settings.module.css";

export default function DangerZone({ onToast }) {
  const navigate = useNavigate();
  const { profile, deleteAccount } = useProfile();
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = () => {
    navigate("/");
    deleteAccount();
    onToast?.("ลบบัญชีเรียบร้อยแล้ว", "👋");
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>ลบบัญชี</h2>
      <p className={styles.desc}>การดำเนินการในส่วนนี้ไม่สามารถย้อนกลับได้</p>

      <div className={styles.dangerBox}>
        <div className={styles.dangerHead}>
          <Icon name="alert" size={20} />
          <p>
            <strong>ลบบัญชีถาวร</strong>
            รีวิว คะแนน และรายการอยากดูทั้งหมดของคุณจะถูกลบ และไม่สามารถกู้คืนได้
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="dz-confirm">
            พิมพ์ "{profile.username}" เพื่อยืนยัน
          </label>
          <input
            id="dz-confirm"
            className={styles.input}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className={styles.actions} style={{ justifyContent: "flex-start" }}>
          <button
            className={`${styles.btn} ${styles.btnDangerSolid}`}
            disabled={confirmText !== profile.username}
            onClick={handleDelete}
          >
            <Icon name="trash" size={15} />
            ลบบัญชีของฉัน
          </button>
        </div>
      </div>
    </section>
  );
}
