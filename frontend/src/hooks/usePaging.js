import { useState } from "react";

// แบ่งหน้ารายการ — เรียก reset() เมื่อเปลี่ยนตัวกรองเพื่อกลับไปหน้าแรก
export default function usePaging(items, pageSize = 10) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(page, pages);
  const start = (current - 1) * pageSize;
  return {
    rows: items.slice(start, start + pageSize),
    pager: {
      page: current,
      pages,
      total: items.length,
      from: items.length ? start + 1 : 0,
      to: Math.min(start + pageSize, items.length),
      onPage: (n) => setPage(Math.min(Math.max(1, n), pages)),
    },
    reset: () => setPage(1),
  };
}
