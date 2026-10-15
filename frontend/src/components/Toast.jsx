import { useEffect } from 'react'
import styles from '../css/components/Toast.module.css'

export default function Toast({ toast, onHide }) {
  useEffect(() => {
    if (!toast.show) return
    const t = setTimeout(onHide, 3000)
    return () => clearTimeout(t)
    // ขึ้นกับ toast ทั้งก้อน: toast ใหม่ระหว่างที่อันเดิมยังแสดง จะเริ่มนับเวลาใหม่
  }, [toast, onHide])

  return (
    <div className={`${styles.toast} ${toast.show ? styles.show : ''}`}>
      <span className={styles.icon}>{toast.icon}</span>
      <span className={styles.msg}>{toast.msg}</span>
    </div>
  )
}