// จัดรูปแบบวันที่/เวลาเป็นภาษาไทย (ใช้ในหน้าผู้ดูแล)

export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
    : "–";

export const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("th-TH", {
        day: "numeric",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "–";

const UNITS = [
  { s: 60 * 60 * 24 * 365, label: "ปี" },
  { s: 60 * 60 * 24 * 30, label: "เดือน" },
  { s: 60 * 60 * 24, label: "วัน" },
  { s: 60 * 60, label: "ชั่วโมง" },
  { s: 60, label: "นาที" },
];

export function timeAgo(iso) {
  if (!iso) return "–";
  const sec = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  const unit = UNITS.find((u) => sec >= u.s);
  return unit ? `${Math.floor(sec / unit.s)} ${unit.label}ที่แล้ว` : "เมื่อสักครู่";
}
