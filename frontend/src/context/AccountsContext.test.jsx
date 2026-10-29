import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderStore } from "../test/utils";
import { DEMO_ADMIN } from "../data/accounts";
import { load } from "../utils/storage";

// ล็อกอินแล้วคืนผลลัพธ์ ({ account } หรือ { error })
const loginAs = (result, username, password) => {
  let out;
  act(() => {
    out = result.current.login(username, password);
  });
  return out;
};

describe("AccountsContext — authentication", () => {
  it("logs in the demo admin and grants admin rights", () => {
    const { result } = renderStore();
    const out = loginAs(result, DEMO_ADMIN.username, DEMO_ADMIN.password);
    expect(out.account.role).toBe("admin");
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.account.lastLoginAt).not.toBeNull();
  });

  it("rejects a wrong password without logging in", () => {
    const { result } = renderStore();
    expect(loginAs(result, "admin", "wrong")).toEqual({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    expect(result.current.account).toBeNull();
  });

  it("requires both username and password", () => {
    const { result } = renderStore();
    expect(loginAs(result, "  ", "x").error).toMatch(/กรุณากรอก/);
  });

  it("auto-creates an account for a new username, then enforces its password", () => {
    const { result } = renderStore();
    loginAs(result, "newbie", "Movie2026");
    expect(result.current.accounts.newbie).toMatchObject({ role: "user", status: "active" });
    expect(result.current.isAdmin).toBe(false);
    expect(loginAs(result, "newbie", "other").error).toBeDefined();
  });

  it("blocks community accounts that have no password yet", () => {
    const { result } = renderStore();
    expect(loginAs(result, "mintra", "anything").error).toMatch(/ยังไม่ได้ตั้งรหัสผ่าน/);
  });

  it("validates registration input", () => {
    const { result } = renderStore();
    const register = (data) => {
      let out;
      act(() => {
        out = result.current.register({ username: "valid_user", email: "a@b.co", password: "secret1", ...data });
      });
      return out.error;
    };
    expect(register({ username: "admin" })).toBe("ชื่อผู้ใช้นี้ถูกใช้แล้ว");
    expect(register({ username: "no spaces" })).toMatch(/a-z/);
    expect(register({ email: "not-an-email" })).toMatch(/อีเมล/);
    expect(register({ password: "123" })).toMatch(/6 ตัวอักษร/);
    expect(register({})).toBeUndefined();
    expect(result.current.account.username).toBe("valid_user");
  });

  it("changes the password only when the current one is correct", () => {
    const { result } = renderStore();
    loginAs(result, "admin", DEMO_ADMIN.password);
    let out;
    act(() => {
      out = result.current.changePassword("wrong", "NewPass99");
    });
    expect(out.error).toBe("รหัสผ่านปัจจุบันไม่ถูกต้อง");
    act(() => {
      out = result.current.changePassword(DEMO_ADMIN.password, "NewPass99");
    });
    expect(out).toEqual({});
    expect(loginAs(result, "admin", "NewPass99").account).toBeDefined();
  });

  it("persists accounts to localStorage without plain-text passwords", () => {
    const { result } = renderStore();
    loginAs(result, "persisted", "PlainText1");
    const stored = load("accounts", {});
    expect(stored.persisted).toBeDefined();
    expect(JSON.stringify(stored)).not.toContain("PlainText1");
  });
});

describe("AccountsContext — admin safeguards", () => {
  const asAdmin = () => {
    const store = renderStore();
    loginAs(store.result, "admin", DEMO_ADMIN.password);
    return store;
  };

  it("prevents admins from changing their own role, status or deleting themselves", () => {
    const { result } = asAdmin();
    expect(result.current.setRole("admin", "user").error).toMatch(/ตัวเอง/);
    expect(result.current.setStatus("admin", "suspended").error).toMatch(/ตัวเอง/);
    expect(result.current.deleteAccountAsAdmin("admin").error).toMatch(/ตัวเอง/);
  });

  it("lets an admin manage other admins while another admin remains", () => {
    const { result } = asAdmin();
    act(() => {
      expect(result.current.setRole("mintra", "admin")).toEqual({});
    });
    act(() => {
      expect(result.current.setStatus("mintra", "suspended")).toEqual({});
    });
    act(() => {
      expect(result.current.setRole("mintra", "user")).toEqual({});
    });
    expect(result.current.accounts.mintra).toMatchObject({ role: "user", status: "suspended" });
  });

  it("never removes, demotes or suspends the last active admin", () => {
    // ป้องกันซ้ำในชั้นข้อมูล แม้หน้าเว็บจะไม่ให้ผู้ใช้ทั่วไปเรียกได้อยู่แล้ว
    const { result } = renderStore({ user: "tester" });
    expect(result.current.setRole("admin", "user").error).toBe("ต้องมีผู้ดูแลระบบอย่างน้อย 1 คน");
    expect(result.current.setStatus("admin", "suspended").error).toMatch(/อย่างน้อย 1 คน/);
    expect(result.current.deleteAccountAsAdmin("admin").error).toMatch(/อย่างน้อย 1 คน/);
  });

  it("suspends a user so they can no longer log in", () => {
    const { result } = asAdmin();
    loginAs(result, "victim", "Pass1234"); // สร้างบัญชี (สลับไปเป็น victim)
    loginAs(result, "admin", DEMO_ADMIN.password);
    act(() => {
      result.current.setStatus("victim", "suspended");
    });
    expect(loginAs(result, "victim", "Pass1234").error).toMatch(/ถูกระงับ/);
  });

  it("issues a temporary password that works for the next login", () => {
    const { result } = asAdmin();
    let out;
    act(() => {
      out = result.current.resetPassword("mintra");
    });
    expect(out.password).toMatch(/^Pf-[A-Za-z0-9]{8}$/);
    expect(loginAs(result, "mintra", out.password).account.username).toBe("mintra");
  });

  it("deletes another account and its profile data", () => {
    const { result } = asAdmin();
    act(() => {
      result.current.adminUpdateProfile("tonkla_cine", { firstName: "Edited" });
    });
    act(() => {
      expect(result.current.deleteAccountAsAdmin("tonkla_cine")).toEqual({});
      result.current.adminDeleteUserData("tonkla_cine");
    });
    expect(result.current.accounts.tonkla_cine).toBeUndefined();
    expect(load("profiles", {}).tonkla_cine).toBeUndefined();
  });

  it("records admin actions newest first", () => {
    const { result } = asAdmin();
    act(() => result.current.logAction("เพิ่มหนัง", "Dune"));
    act(() => result.current.logAction("ลบหนัง", "Dune"));
    expect(result.current.auditLog.map((e) => e.action)).toEqual(["ลบหนัง", "เพิ่มหนัง"]);
    expect(result.current.auditLog[0]).toMatchObject({ by: "admin", target: "Dune" });
  });

  it("logs out the current user if their account becomes suspended", () => {
    const { result } = renderStore({ user: "mintra" });
    expect(result.current.account.username).toBe("mintra");
    act(() => {
      result.current.updateAccount("mintra", { status: "suspended" });
    });
    expect(result.current.account).toBeNull();
  });
});
