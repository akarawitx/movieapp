import { Navigate, useLocation } from "react-router-dom";
import { useAccounts } from "../../context/AccountsContext";
import NotFoundPage from "../../pages/NotFoundPage";

// เข้าได้เฉพาะผู้ดูแลระบบ: ยังไม่ล็อกอิน → ให้ล็อกอินก่อน, ผู้ใช้ทั่วไป → แสดง 404 (ไม่บอกว่ามีหน้านี้)
// หมายเหตุ: เป็นแค่การกันฝั่งหน้าเว็บ ระบบจริงต้องตรวจสิทธิ์ที่ backend ทุกครั้ง
export default function AdminRoute({ user, children }) {
  const { pathname } = useLocation();
  const { isAdmin } = useAccounts();
  if (!user) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          requireLogin: true,
          from: pathname,
          message: "เข้าสู่ระบบด้วยบัญชีผู้ดูแลเพื่อเข้าหน้านี้",
        }}
      />
    );
  }
  if (!isAdmin) return <NotFoundPage />;
  return children;
}
