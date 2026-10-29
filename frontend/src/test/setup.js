// ตั้งค่าก่อนรันเทสต์ทุกไฟล์ (Vitest + Testing Library + jsdom)
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom ไม่มี API เหล่านี้ → ทำตัวจำลองไว้ให้คอมโพเนนต์ที่เรียกใช้
window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();
globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// ทุกเทสต์เริ่มจาก localStorage ว่าง (ข้อมูลจำลองของแอปเก็บไว้ที่นี่)
beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});
