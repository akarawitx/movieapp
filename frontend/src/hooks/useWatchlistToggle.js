import { useProfile } from "../context/ProfileContext";
import useLoginPrompt from "./useLoginPrompt";

// ปุ่มเพิ่ม/นำออกจากรายการอยากดู ใช้ร่วมกันหลายหน้า (ยังไม่ล็อกอิน → เปิดหน้าต่าง Login)
export default function useWatchlistToggle(user, onToast) {
  const { isInWatchlist, toggleWatchlist } = useProfile();
  const promptLogin = useLoginPrompt();

  const toggle = (movie) => {
    if (!user) return promptLogin("เข้าสู่ระบบเพื่อเพิ่มหนังในรายการอยากดู");
    const added = toggleWatchlist(movie.id);
    onToast?.(
      added
        ? `เพิ่ม "${movie.title}" ในรายการอยากดูแล้ว`
        : `นำ "${movie.title}" ออกจากรายการแล้ว`,
      added ? "✅" : "➖"
    );
  };

  const inList = (movie) => !!user && isInWatchlist(movie.id);

  return { toggle, inList };
}
