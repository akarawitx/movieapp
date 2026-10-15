import { splitHighlight } from "../utils/search";

// ไฮไลต์คำที่ค้นในข้อความ (สีมาจาก CSS ของแต่ละที่ผ่าน className)
export default function Highlight({ text, query, className }) {
  return splitHighlight(text, query).map((part, i) =>
    part.hit ? (
      <mark key={i} className={className}>
        {part.text}
      </mark>
    ) : (
      part.text
    )
  );
}
