import { useState } from "react";

// เรียงตามคอลัมน์ในตาราง: กดซ้ำคอลัมน์เดิมเพื่อสลับทิศ
export default function useSort(initialKey, initialDir = -1) {
  const [sort, setSort] = useState({ key: initialKey, dir: initialDir });
  const onSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: key === "title" ? 1 : -1 }));
  const compare = (getValue) => (a, b) => {
    const x = getValue(a, sort.key);
    const y = getValue(b, sort.key);
    const r = typeof x === "string" ? x.localeCompare(y ?? "") : (x ?? 0) - (y ?? 0);
    return r * sort.dir;
  };
  return { sort, onSort, compare };
}
