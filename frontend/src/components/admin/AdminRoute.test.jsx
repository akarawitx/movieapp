import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Route, Routes, useLocation } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import { renderWithRouter } from "../../test/utils";

// หน้าแรกจำลอง: แสดง state ที่ AdminRoute ส่งมา เพื่อตรวจว่าขอให้ล็อกอินและจำหน้าเดิมไว้
function Home() {
  const { state } = useLocation();
  return <p>home:{state ? `${state.requireLogin}:${state.from}` : "none"}</p>;
}

const renderAt = (user) =>
  renderWithRouter(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/admin/*"
        element={
          <AdminRoute user={user}>
            <h1>Admin area</h1>
          </AdminRoute>
        }
      />
    </Routes>,
    { route: "/admin/users", user }
  );

describe("AdminRoute", () => {
  it("sends guests home and asks them to log in, remembering the page", () => {
    renderAt(null);
    expect(screen.getByText("home:true:/admin/users")).toBeInTheDocument();
    expect(screen.queryByText("Admin area")).not.toBeInTheDocument();
  });

  it("shows a 404 to signed-in users who are not admins", () => {
    renderAt("tester");
    expect(screen.getByText("ฉากนี้ถูกตัดทิ้งไปแล้ว")).toBeInTheDocument();
    expect(screen.queryByText("Admin area")).not.toBeInTheDocument();
  });

  it("renders the admin area for admins", () => {
    renderAt("admin");
    expect(screen.getByRole("heading", { name: "Admin area" })).toBeInTheDocument();
  });
});
