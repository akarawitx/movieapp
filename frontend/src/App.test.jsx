// เทสต์แบบ integration: render ทั้งแอปแล้วใช้งานเหมือนผู้ใช้จริง (คลิก/พิมพ์ผ่าน user-event)
import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { renderApp } from "./test/utils";
import { save } from "./utils/storage";

const LAZY = { timeout: 5000 }; // หน้า admin โหลดแบบ lazy

const openLoginModal = async (user) => {
  await user.click(within(screen.getByRole("navigation")).getByRole("button", { name: "เข้าสู่ระบบ" }));
};

const submitLogin = async (user, username, password) => {
  const name = screen.getByPlaceholderText("กรอกชื่อผู้ใช้");
  const pass = screen.getByPlaceholderText("กรอกรหัสผ่าน");
  await user.clear(name);
  await user.type(name, username);
  await user.clear(pass);
  await user.type(pass, password);
  await user.click(screen.getAllByRole("button", { name: "เข้าสู่ระบบ" }).at(-1));
};

describe("App — authentication", () => {
  it("lets the admin sign in from the header and opens the dashboard", async () => {
    const user = userEvent.setup();
    renderApp(App);

    await openLoginModal(user);
    await submitLogin(user, "admin", "wrong-password");
    expect(screen.getByRole("alert")).toHaveTextContent("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");

    await submitLogin(user, "admin", "Admin@1234");
    expect(await screen.findByRole("heading", { name: "แดชบอร์ด" }, LAZY)).toBeInTheDocument();
    // หน้าผู้ดูแลใช้ layout ของตัวเอง ไม่มี Header ของหน้าเว็บ
    expect(screen.queryByRole("button", { name: "รายการหนังทั้งหมด" })).not.toBeInTheDocument();
  });

  it("does not reopen the login dialog after logging out from a protected page", async () => {
    const user = userEvent.setup();
    save("user", "tester");
    renderApp(App, { route: "/profile" });

    await user.click(screen.getByRole("button", { name: "เมนูบัญชีผู้ใช้" }));
    await user.click(screen.getByRole("menuitem", { name: "ออกจากระบบ" }));

    expect(within(screen.getByRole("navigation")).getByRole("button", { name: "เข้าสู่ระบบ" })).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("กรอกรหัสผ่าน")).not.toBeInTheDocument();
  });

  it("only shows the admin panel link to admins", async () => {
    const user = userEvent.setup();
    save("user", "tester");
    renderApp(App);
    await user.click(screen.getByRole("button", { name: "เมนูบัญชีผู้ใช้" }));
    expect(screen.queryByRole("menuitem", { name: "แผงผู้ดูแลระบบ" })).not.toBeInTheDocument();
  });
});

describe("App — admin workflows", () => {
  it("creates a movie in the admin panel and shows it on the public site", async () => {
    const user = userEvent.setup();
    save("user", "admin");
    renderApp(App, { route: "/admin/movies/new" });

    const title = await screen.findByLabelText(/^ชื่อเรื่อง/, {}, LAZY);
    await user.type(title, "Lahn Mah");
    expect(screen.getByLabelText(/^id/)).toHaveValue("lahn-mah");

    // ส่งฟอร์มว่างบางช่อง → ต้องแจ้งข้อผิดพลาดและยังไม่บันทึก
    await user.click(screen.getAllByRole("button", { name: "เพิ่มหนัง" })[0]);
    expect(screen.getByRole("alert")).toHaveTextContent("ยังมีข้อมูลที่ต้องแก้ไข");

    await user.selectOptions(screen.getByLabelText(/^แนวหนัง/), "drama");
    await user.type(screen.getByLabelText("ชั่วโมง"), "2");
    await user.type(screen.getByLabelText("นาที"), "5");
    await user.type(screen.getByLabelText(/^ผู้กำกับ/), "Pat Boonnitipat");
    await user.type(
      screen.getByLabelText(/^เรื่องย่อ/),
      "A young man takes care of his terminally ill grandmother."
    );
    await user.click(screen.getAllByRole("button", { name: "เพิ่มหนัง" })[0]);

    // กลับมาหน้ารายการ พร้อมหนังเรื่องใหม่
    expect(await screen.findByRole("link", { name: "Lahn Mah" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent('เพิ่ม "Lahn Mah" แล้ว');

    // ไปหน้าเว็บ → หนังใหม่แสดงในรายการหนังทั้งหมด
    await user.click(screen.getByRole("link", { name: "กลับไปหน้าเว็บ" }));
    await user.click(screen.getByRole("button", { name: "รายการหนังทั้งหมด" }));
    expect(await screen.findByText("Lahn Mah")).toBeInTheDocument();
  });

  it("suspends a community reviewer after confirmation", async () => {
    const user = userEvent.setup();
    save("user", "admin");
    renderApp(App, { route: "/admin/users/mintra" });

    await user.click(await screen.findByRole("button", { name: "ระงับบัญชี" }, LAZY));
    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveTextContent("ระงับบัญชี @mintra?");
    await user.click(within(dialog).getByRole("button", { name: "ระงับบัญชี" }));

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ยกเลิกการระงับบัญชี" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("ระงับบัญชีแล้ว");
  });

  it("disables destructive actions on the admin's own account", async () => {
    save("user", "admin");
    renderApp(App, { route: "/admin/users/admin" });
    expect(await screen.findByRole("button", { name: "ลบบัญชี" }, LAZY)).toBeDisabled();
    expect(screen.getByRole("button", { name: "ระงับบัญชี" })).toBeDisabled();
  });
});
