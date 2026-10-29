import { describe, expect, it } from "vitest";
import { matchReason, normalize, searchMovies, searchReviews, splitHighlight } from "./search";

const movie = (overrides) => ({
  id: "x",
  title: "Untitled",
  director: "Someone",
  cast: "Actor A, Actor B",
  genre: "drama",
  genreLabel: "ดราม่า",
  year: 2024,
  score: 7,
  synopsis: "",
  ...overrides,
});

const MOVIES = [
  movie({ id: "dune2", title: "Dune: Part Two", director: "Denis Villeneuve", cast: "Timothée Chalamet, Zendaya", genre: "scifi", genreLabel: "Sci-Fi", score: 8.7 }),
  movie({ id: "dune", title: "Dune", director: "Denis Villeneuve", score: 8.0, year: 2021 }),
  movie({ id: "oppenheimer", title: "Oppenheimer", director: "Christopher Nolan", cast: "Cillian Murphy, Emily Blunt", score: 8.9, year: 2023 }),
  movie({ id: "civil", title: "Civil War", cast: "Kirsten Dunst", genre: "action", genreLabel: "แอ็คชั่น", synopsis: "A war photographer crosses America", score: 7.5 }),
];

const ids = (list) => list.map((m) => m.id);

describe("normalize", () => {
  it("lower-cases and trims", () => {
    expect(normalize("  DuNe ")).toBe("dune");
  });

  it("treats null and undefined as an empty string", () => {
    expect(normalize(null)).toBe("");
    expect(normalize(undefined)).toBe("");
  });
});

describe("searchMovies", () => {
  it("returns nothing for a blank query", () => {
    expect(searchMovies(MOVIES, "   ")).toEqual([]);
  });

  it("ranks an exact title match above a prefix match", () => {
    expect(ids(searchMovies(MOVIES, "dune"))).toEqual(["dune", "dune2"]);
  });

  it("finds movies by director, cast, genre label and year", () => {
    expect(ids(searchMovies(MOVIES, "nolan"))).toEqual(["oppenheimer"]);
    expect(ids(searchMovies(MOVIES, "zendaya"))).toEqual(["dune2"]);
    expect(ids(searchMovies(MOVIES, "แอ็คชั่น"))).toEqual(["civil"]);
    expect(ids(searchMovies(MOVIES, "2021"))).toEqual(["dune"]);
  });

  it("matches the synopsis with the lowest priority", () => {
    expect(ids(searchMovies(MOVIES, "photographer"))).toEqual(["civil"]);
  });

  it("breaks ties by score, highest first", () => {
    // ทั้งสองเรื่องตรงที่ชื่อผู้กำกับเท่ากัน
    expect(ids(searchMovies(MOVIES, "villeneuve"))).toEqual(["dune2", "dune"]);
  });

  it("is case-insensitive", () => {
    expect(ids(searchMovies(MOVIES, "OPPEN"))).toEqual(["oppenheimer"]);
  });
});

describe("matchReason", () => {
  it("returns null when the title already matches", () => {
    expect(matchReason(MOVIES[2], "oppen")).toBeNull();
  });

  it("explains director and cast matches", () => {
    expect(matchReason(MOVIES[2], "nolan")).toBe("ผู้กำกับ: Christopher Nolan");
    expect(matchReason(MOVIES[2], "blunt")).toBe("นักแสดง: Emily Blunt");
  });
});

describe("searchReviews", () => {
  const entries = [
    { movie: MOVIES[0], review: { title: "Epic", body: "Stunning visuals", name: "Mintra", spoiler: false, likes: 5 } },
    { movie: MOVIES[2], review: { title: "Long", body: "Stunning ending twist", name: "Nat", spoiler: true, likes: 50 } },
    { movie: MOVIES[3], review: { title: "Tense", body: "Great sound", name: "Stunning Reviewer", spoiler: false, likes: 20 } },
  ];

  it("searches title, body and author, sorted by likes", () => {
    expect(searchReviews(entries, "stunning").map((e) => e.review.title)).toEqual(["Tense", "Epic"]);
  });

  it("never matches inside a spoiler body", () => {
    expect(searchReviews(entries, "twist")).toEqual([]);
  });

  it("matches by movie title", () => {
    expect(searchReviews(entries, "oppenheimer")).toHaveLength(1);
  });
});

describe("splitHighlight", () => {
  it("splits text into hit and non-hit parts", () => {
    expect(splitHighlight("Dune: Part Two", "part")).toEqual([
      { text: "Dune: ", hit: false },
      { text: "Part", hit: true },
      { text: " Two", hit: false },
    ]);
  });

  it("escapes regex special characters in the query", () => {
    expect(splitHighlight("Deadpool & Wolverine (2024)", "(2024)")).toContainEqual({ text: "(2024)", hit: true });
  });

  it("returns the whole text when the query is empty", () => {
    expect(splitHighlight("Dune", " ")).toEqual([{ text: "Dune", hit: false }]);
  });
});
