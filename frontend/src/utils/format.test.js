import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatDate, formatDateTime, timeAgo } from "./format";

describe("format", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-26T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows a dash for missing dates", () => {
    expect(formatDate(null)).toBe("–");
    expect(formatDateTime(undefined)).toBe("–");
    expect(timeAgo(null)).toBe("–");
  });

  it("formats dates in the Thai Buddhist calendar", () => {
    expect(formatDate("2026-10-26T12:00:00Z")).toContain("2569");
  });

  it.each([
    ["2026-10-26T11:59:30Z", "เมื่อสักครู่"],
    ["2026-10-26T11:55:00Z", "5 นาทีที่แล้ว"],
    ["2026-10-26T09:00:00Z", "3 ชั่วโมงที่แล้ว"],
    ["2026-10-24T12:00:00Z", "2 วันที่แล้ว"],
    ["2025-10-01T12:00:00Z", "1 ปีที่แล้ว"],
  ])("timeAgo(%s) → %s", (iso, expected) => {
    expect(timeAgo(iso)).toBe(expected);
  });

  it("never reports a negative duration for future timestamps", () => {
    expect(timeAgo("2026-10-27T12:00:00Z")).toBe("เมื่อสักครู่");
  });
});
