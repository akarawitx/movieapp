import { Navigate, useLocation } from "react-router-dom";

// เข้าได้เฉพาะผู้ที่ล็อกอินแล้ว ถ้ายังไม่ล็อกอินจะพากลับหน้าแรกและให้ Header เปิดหน้าต่าง Login
export default function ProtectedRoute({ user, children }) {
  const { pathname } = useLocation();
  if (!user) {
    return (
      <Navigate to="/" replace state={{ requireLogin: true, from: pathname }} />
    );
  }
  return children;
}
