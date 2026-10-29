import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import usePaging from "./usePaging";
import useSort from "./useSort";

const items = Array.from({ length: 23 }, (_, i) => i + 1);

describe("usePaging", () => {
  it("returns the first page and pager metadata", () => {
    const { result } = renderHook(() => usePaging(items, 10));
    expect(result.current.rows).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(result.current.pager).toMatchObject({ page: 1, pages: 3, total: 23, from: 1, to: 10 });
  });

  it("clamps navigation to the valid page range", () => {
    const { result } = renderHook(() => usePaging(items, 10));
    act(() => result.current.pager.onPage(99));
    expect(result.current.pager).toMatchObject({ page: 3, from: 21, to: 23 });
    act(() => result.current.pager.onPage(-1));
    expect(result.current.pager.page).toBe(1);
  });

  it("stays on a valid page when the list shrinks", () => {
    const { result, rerender } = renderHook(({ list }) => usePaging(list, 10), {
      initialProps: { list: items },
    });
    act(() => result.current.pager.onPage(3));
    rerender({ list: items.slice(0, 5) });
    expect(result.current.pager.page).toBe(1);
    expect(result.current.rows).toEqual([1, 2, 3, 4, 5]);
  });

  it("reports an empty range for an empty list", () => {
    const { result } = renderHook(() => usePaging([], 10));
    expect(result.current.pager).toMatchObject({ total: 0, from: 0, to: 0, pages: 1 });
  });
});

describe("useSort", () => {
  const rows = [
    { title: "B", score: 7 },
    { title: "A", score: 9 },
    { title: "C", score: 8 },
  ];
  const get = (row, key) => row[key];

  it("sorts numbers descending by default", () => {
    const { result } = renderHook(() => useSort("score"));
    expect([...rows].sort(result.current.compare(get)).map((r) => r.score)).toEqual([9, 8, 7]);
  });

  it("toggles direction when the same column is clicked again", () => {
    const { result } = renderHook(() => useSort("score"));
    act(() => result.current.onSort("score"));
    expect([...rows].sort(result.current.compare(get)).map((r) => r.score)).toEqual([7, 8, 9]);
  });

  it("sorts titles alphabetically when switching to the title column", () => {
    const { result } = renderHook(() => useSort("score"));
    act(() => result.current.onSort("title"));
    expect(result.current.sort).toEqual({ key: "title", dir: 1 });
    expect([...rows].sort(result.current.compare(get)).map((r) => r.title)).toEqual(["A", "B", "C"]);
  });
});
