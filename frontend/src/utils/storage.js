// เก็บข้อมูลจำลองไว้ใน localStorage ให้อยู่ข้ามการรีเฟรช (ยังไม่ต่อ API)
// ทุกการเข้าถึงห่อด้วย try/catch เพราะ localStorage อาจถูกปิด เต็ม หรือใช้ไม่ได้ในโหมดส่วนตัว

const PREFIX = "pixelfilm.v1.";

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// คืนค่า false ถ้าบันทึกไม่สำเร็จ (เช่น พื้นที่เต็มเพราะรูปโปรไฟล์ใหญ่)
export function save(key, value) {
  try {
    if (value === null || value === undefined) localStorage.removeItem(PREFIX + key);
    else localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
