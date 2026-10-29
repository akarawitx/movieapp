import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderStore } from "../test/utils";
import useCommunityReviews, { buildReviewerProfile } from "./useCommunityReviews";

const setup = () => renderStore({ user: "admin", extra: useCommunityReviews });
const reviewsOf = (result, movieId) =>
  result.current.extra.getReviews(result.current.getMovie(movieId));

describe("useCommunityReviews", () => {
  it("returns mock reviews for every published movie", () => {
    const { result } = setup();
    const movieIds = new Set(result.current.extra.all.map((e) => e.movie.id));
    expect(movieIds.size).toBe(result.current.movies.length);
  });

  it("drops reviews hidden by a moderator", () => {
    const { result } = setup();
    const [first] = reviewsOf(result, "dune2");
    act(() => result.current.setReviewHidden(first.id, true));
    expect(reviewsOf(result, "dune2").map((r) => r.id)).not.toContain(first.id);
  });

  it("drops every review written by a suspended reviewer", () => {
    const { result } = setup();
    const author = result.current.extra.all[0].review.username;
    act(() => {
      result.current.setStatus(author, "suspended");
    });
    expect(result.current.extra.all.some((e) => e.review.username === author)).toBe(false);
  });

  it("excludes reviews of hidden movies from the public feed", () => {
    const { result } = setup();
    act(() => result.current.updateMovie("oppenheimer", { status: "hidden" }));
    expect(result.current.extra.all.some((e) => e.movie.id === "oppenheimer")).toBe(false);
  });
});

describe("buildReviewerProfile", () => {
  it("builds a public profile with reviews sorted newest first and spoilers masked", () => {
    const { result } = setup();
    const reviewer = { username: "mintra", name: "Mintra", bio: "", location: "", joinedAt: "2024-01-01", favoriteGenres: [] };
    const { profile, activity, likes } = buildReviewerProfile(reviewer, result.current.extra.all);
    expect(profile.username).toBe("mintra");
    const dates = activity.reviews.map((r) => r.date);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(likes).toBeGreaterThanOrEqual(0);
    const spoilers = result.current.extra.all.filter((e) => e.review.username === "mintra" && e.review.spoiler);
    spoilers.forEach(({ review }) => {
      expect(activity.reviews.find((r) => r.id === review.id).body).not.toBe(review.body);
    });
  });
});
