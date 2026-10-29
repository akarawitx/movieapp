// ตัวช่วยสำหรับเทสต์: ห่อด้วย Router + Providers ทั้งหมดเหมือนในแอปจริง
import { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { render, renderHook } from "@testing-library/react";
import { AccountsProvider, useAccounts } from "../context/AccountsContext";
import { CatalogProvider, useCatalog } from "../context/CatalogContext";
import { ProfileProvider, useProfile } from "../context/ProfileContext";
import { save } from "../utils/storage";

function Providers({ initialUser = null, children }) {
  const [user, setUser] = useState(initialUser);
  return (
    <AccountsProvider user={user} onUserChange={setUser}>
      <CatalogProvider>
        <ProfileProvider user={user} onUserChange={setUser}>
          {children}
        </ProfileProvider>
      </CatalogProvider>
    </AccountsProvider>
  );
}

// เรียก hook ของทุก context พร้อมกัน → ตรวจผลข้าม context ได้ (เช่น ลบบัญชีแล้วโปรไฟล์หายด้วย)
// extra: hook เพิ่มเติมที่ต้องอยู่ใต้ Providers เดียวกัน (ผลอยู่ใน result.current.extra)
const noop = () => undefined;
export function renderStore({ user = null, extra = noop } = {}) {
  return renderHook(
    () => ({ ...useAccounts(), ...useCatalog(), ...useProfile(), extra: extra() }),
    {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <Providers initialUser={user}>{children}</Providers>
        </MemoryRouter>
      ),
    }
  );
}

// render คอมโพเนนต์หรือทั้งแอปที่ path ที่กำหนด (ผู้ใช้ที่ล็อกอินอยู่ อ่านจาก localStorage เหมือนแอปจริง)
export function renderWithRouter(ui, { route = "/", user = null } = {}) {
  if (user) save("user", user);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Providers initialUser={user}>{ui}</Providers>
    </MemoryRouter>
  );
}

// render ทั้งแอป (App มี Providers และ state ผู้ใช้ของตัวเอง)
export function renderApp(App, { route = "/" } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
}
