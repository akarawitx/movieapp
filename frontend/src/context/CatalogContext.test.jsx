import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderStore } from "../test/utils";
import { load } from "../utils/storage";

const NEW_MOVIE = {
  id: "lahn-mah",
  title: "หลานม่า",
  year: 2024,
  duration: "2h 5m",
  genre: "drama",
  status: "published",
  director: "พัฒน์ บุณฑริกพรรณ",
  cast: "บิวกิ้น พุฒิพงศ์",
  synopsis: "หลานชายผันตัวมาดูแลอาม่าที่ป่วยหนัก",
  score: 8.6,
  reviews: 0,
};

describe("CatalogContext — movies", () => {
  it("seeds nine published movies with derived genre labels", () => {
    const { result } = renderStore();
    expect(result.current.movies).toHaveLength(9);
    expect(result.current.getMovie("insideo").genreLabel).toBe("แอนิเมชั่น");
  });

  it("creates a movie that is immediately visible and persisted", () => {
    const { result } = renderStore();
    act(() => {
      result.current.createMovie(NEW_MOVIE);
    });
    expect(result.current.movies[0]).toMatchObject({ id: "lahn-mah", genreLabel: "ดราม่า" });
    expect(result.current.movies[0].createdAt).toBeDefined();
    expect(load("catalog", null).movies.some((m) => m.id === "lahn-mah")).toBe(true);
  });

  it("updates a movie but never changes its id", () => {
    const { result } = renderStore();
    act(() => {
      result.current.updateMovie("dune2", { title: "Dune 2", id: "hacked" });
    });
    expect(result.current.getMovie("dune2").title).toBe("Dune 2");
    expect(result.current.getMovie("hacked")).toBeUndefined();
  });

  it("hides unpublished movies from the public list but keeps them for admins", () => {
    const { result } = renderStore();
    act(() => {
      result.current.updateMovie("alien", { status: "hidden" });
    });
    expect(result.current.movies.map((m) => m.id)).not.toContain("alien");
    expect(result.current.allMovies.map((m) => m.id)).toContain("alien");
  });

  it("restores a deleted movie at its original position (undo)", () => {
    const { result } = renderStore();
    const before = result.current.allMovies.map((m) => m.id);
    let removed;
    act(() => {
      removed = result.current.deleteMovie("godzilla");
    });
    expect(result.current.getMovie("godzilla")).toBeUndefined();
    act(() => {
      result.current.restoreMovie(removed.movie, removed.index);
    });
    expect(result.current.allMovies.map((m) => m.id)).toEqual(before);
  });

  it("resets the catalog to the seed data", () => {
    const { result } = renderStore();
    act(() => {
      result.current.deleteMovie("dune2");
    });
    act(() => {
      result.current.resetCatalog();
    });
    expect(result.current.getMovie("dune2")).toBeDefined();
  });
});

describe("CatalogContext — genres", () => {
  it("refuses to delete a genre that is still in use", () => {
    const { result } = renderStore();
    expect(result.current.deleteGenre("action").error).toBeDefined();
    expect(result.current.genres.some((g) => g.id === "action")).toBe(true);
  });

  it("adds and deletes an unused genre", () => {
    const { result } = renderStore();
    act(() => {
      result.current.saveGenre({ id: "documentary", label: "สารคดี" }, null);
    });
    expect(result.current.genres.at(-1)).toEqual({ id: "documentary", label: "สารคดี" });
    act(() => {
      expect(result.current.deleteGenre("documentary")).toEqual({});
    });
    expect(result.current.genres.some((g) => g.id === "documentary")).toBe(false);
  });

  it("moves movies along when a genre id is renamed", () => {
    const { result } = renderStore();
    act(() => {
      result.current.saveGenre({ id: "sci-fi", label: "ไซไฟ" }, "scifi");
    });
    expect(result.current.getMovie("dune2")).toMatchObject({ genre: "sci-fi", genreLabel: "ไซไฟ" });
    expect(result.current.countByGenre("scifi")).toBe(0);
  });

  it("reorders genres and ignores moves past either end", () => {
    const { result } = renderStore();
    const first = result.current.genres[0].id;
    act(() => result.current.moveGenre(first, -1));
    expect(result.current.genres[0].id).toBe(first);
    act(() => result.current.moveGenre(first, 1));
    expect(result.current.genres[1].id).toBe(first);
  });
});

describe("CatalogContext — review moderation", () => {
  it("toggles a review's hidden flag without duplicates", () => {
    const { result } = renderStore();
    act(() => result.current.setReviewHidden("dune2-m0", true));
    act(() => result.current.setReviewHidden("dune2-m0", true));
    expect(result.current.hiddenReviews).toEqual(["dune2-m0"]);
    expect(result.current.isReviewHidden("dune2-m0")).toBe(true);
    act(() => result.current.setReviewHidden("dune2-m0", false));
    expect(result.current.hiddenReviews).toEqual([]);
  });
});
