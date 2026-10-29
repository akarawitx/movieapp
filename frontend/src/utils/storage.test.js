import { describe, expect, it, vi } from "vitest";
import { load, save } from "./storage";

describe("storage", () => {
  it("round-trips JSON values under the pixelfilm.v1 prefix", () => {
    expect(save("user", { name: "tester" })).toBe(true);
    expect(localStorage.getItem("pixelfilm.v1.user")).toBe('{"name":"tester"}');
    expect(load("user", null)).toEqual({ name: "tester" });
  });

  it("returns the fallback for missing keys", () => {
    expect(load("missing", "fallback")).toBe("fallback");
  });

  it("returns the fallback when stored data is corrupted", () => {
    localStorage.setItem("pixelfilm.v1.user", "{not json");
    expect(load("user", [])).toEqual([]);
  });

  it("removes the key when saving null", () => {
    save("user", "tester");
    save("user", null);
    expect(localStorage.getItem("pixelfilm.v1.user")).toBeNull();
  });

  it("reports failure instead of throwing when storage is full", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("quota", "QuotaExceededError");
    });
    expect(save("profiles", { big: "x" })).toBe(false);
  });
});
