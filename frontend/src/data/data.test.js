// ตรวจความถูกต้องของข้อมูลตั้งต้น (data integrity) — กันข้อมูลจำลองผิดรูปแบบหลุดเข้าแอป
import { describe, expect, it } from "vitest";
import { GENRES, MOVIES } from "./movies";
import { MOVIE_DETAILS, REVIEWERS, byReleaseDesc, getMovieReviews, getRatingDistribution } from "./movieDetails";
import { seedCatalog, slugify } from "./catalog";
import { DEMO_ADMIN, hashPassword, seedAccounts } from "./accounts";

describe("seed catalog", () => {
  const { movies, genres } = seedCatalog();

  it("has unique movie ids that are valid URL slugs", () => {
    const ids = movies.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(/^[a-z0-9-]+$/));
  });

  it("only references genres that exist", () => {
    const genreIds = new Set(genres.map((g) => g.id));
    movies.forEach((m) => expect(genreIds, `${m.id} → ${m.genre}`).toContain(m.genre));
  });

  it("merges release details into every movie and publishes it", () => {
    movies.forEach((m) => {
      expect(m.status).toBe("published");
      expect(m.releaseDate).toBe(MOVIE_DETAILS[m.id].releaseDate);
      expect(m.score).toBeGreaterThanOrEqual(0);
      expect(m.score).toBeLessThanOrEqual(10);
    });
  });

  it("keeps the source data untouched", () => {
    expect(MOVIES[0]).not.toHaveProperty("status");
    expect(GENRES).toBe(genres);
  });
});

describe("slugify", () => {
  it.each([
    ["Dune: Part Two", "dune-part-two"],
    ["  Deadpool & Wolverine  ", "deadpool-wolverine"],
    ["Amélie", "amelie"],
    ["หลานม่า", ""],
  ])("slugify(%j) → %j", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it("caps the slug at 40 characters", () => {
    expect(slugify("a".repeat(60))).toHaveLength(40);
  });
});

describe("mock community reviews", () => {
  const movie = { id: "dune2", score: 8.7, reviews: 100 };

  it("is deterministic for the same movie", () => {
    expect(getMovieReviews(movie)).toEqual(getMovieReviews(movie));
  });

  it("gives each reviewer at most one review per movie", () => {
    const authors = getMovieReviews(movie).map((r) => r.username);
    expect(new Set(authors).size).toBe(authors.length);
    authors.forEach((u) => expect(REVIEWERS.map((r) => r.username)).toContain(u));
  });

  it("keeps scores within 1–10", () => {
    getMovieReviews({ id: "low", score: 0.5, reviews: 1 }).forEach((r) => {
      expect(r.score).toBeGreaterThanOrEqual(1);
      expect(r.score).toBeLessThanOrEqual(10);
    });
  });

  it("generates no reviews for a movie with zero reviews", () => {
    expect(getMovieReviews({ id: "new", score: 8, reviews: 0 })).toEqual([]);
  });

  it("produces a rating distribution that sums to roughly 100%", () => {
    const total = getRatingDistribution(movie).reduce((s, b) => s + b.percent, 0);
    expect(total).toBeGreaterThanOrEqual(98);
    expect(total).toBeLessThanOrEqual(102);
  });

  it("sorts by release date, newest first, with undated movies last", () => {
    const list = [{ releaseDate: "2024-01-01" }, { releaseDate: null }, { releaseDate: "2025-06-01" }];
    expect(list.sort(byReleaseDesc).map((m) => m.releaseDate)).toEqual(["2025-06-01", "2024-01-01", null]);
  });
});

describe("seed accounts", () => {
  const accounts = seedAccounts();

  it("contains exactly one admin with the documented demo password", () => {
    const admins = Object.values(accounts).filter((a) => a.role === "admin");
    expect(admins).toHaveLength(1);
    expect(admins[0].username).toBe(DEMO_ADMIN.username);
    expect(admins[0].passwordHash).toBe(hashPassword(DEMO_ADMIN.password));
  });

  it("creates community reviewers without a password", () => {
    REVIEWERS.forEach((r) => {
      expect(accounts[r.username]).toMatchObject({ community: true, passwordHash: null, status: "active" });
    });
  });
});

describe("hashPassword", () => {
  it("is deterministic and never stores the plain password", () => {
    const hash = hashPassword("Secret123");
    expect(hash).toBe(hashPassword("Secret123"));
    expect(hash).not.toContain("Secret123");
  });

  it("produces different hashes for different passwords", () => {
    expect(hashPassword("Secret123")).not.toBe(hashPassword("secret123"));
  });
});
