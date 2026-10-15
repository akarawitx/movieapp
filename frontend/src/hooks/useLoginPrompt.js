import { useLocation, useNavigate } from "react-router-dom";

// เปิดหน้าต่าง Login ใน Header จากที่ไหนก็ได้ (ใช้กลไก requireLogin เดียวกับ ProtectedRoute)
export default function useLoginPrompt() {
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();
  return (message) =>
    navigate(`${pathname}${search}${hash}`, {
      replace: true,
      state: { requireLogin: true, message },
    });
}
