import { useMemo } from "react";
import { useCatalog } from "../context/CatalogContext";
import { useAccounts } from "../context/AccountsContext";
import { getMovieReviews } from "../data/movieDetails";

const SPOILER_NOTE = "รีวิวนี้มีสปอยล์ — อ่านได้ในหน้ารายละเอียดหนัง";

// รีวิวจำลองจากชุมชนที่แสดงต่อสาธารณะ
// ซ่อน: รีวิวที่ผู้ดูแลซ่อน, หนังที่ไม่ได้เผยแพร่, และนักรีวิวที่ถูกระงับหรือลบบัญชี
export default function useCommunityReviews() {
  const { movies, hiddenReviews } = useCatalog();
  const { accounts } = useAccounts();

  return useMemo(() => {
    const visible = (r) =>
      !hiddenReviews.includes(r.id) && accounts[r.username]?.status === "active";
    const byMovie = new Map(movies.map((m) => [m.id, getMovieReviews(m).filter(visible)]));
    const all = movies.flatMap((movie) =>
      byMovie.get(movie.id).map((review) => ({ movie, review }))
    );
    return {
      all,
      getReviews: (movie) => byMovie.get(movie.id) ?? getMovieReviews(movie).filter(visible),
    };
  }, [movies, hiddenReviews, accounts]);
}

// สร้างโปรไฟล์ + กิจกรรมของนักรีวิวจำลองจากรีวิวทั้งหมดในระบบ
export function buildReviewerProfile(reviewer, all) {
  const mine = all.filter(({ review }) => review.username === reviewer.username);
  return {
    profile: {
      firstName: reviewer.name,
      lastName: "",
      username: reviewer.username,
      bio: reviewer.bio,
      location: reviewer.location,
      joinedAt: reviewer.joinedAt,
      avatar: null,
      color: reviewer.color,
      favoriteGenres: reviewer.favoriteGenres,
      privacy: { publicProfile: true, showWatchlist: false },
    },
    activity: {
      reviews: mine
        .map(({ movie, review }) => ({
          id: review.id,
          movieId: movie.id,
          score: review.score,
          title: review.title,
          body: review.spoiler ? SPOILER_NOTE : review.body,
          date: review.date,
        }))
        .sort((a, b) => b.date.localeCompare(a.date)),
      ratings: mine.map(({ movie, review }) => ({ movieId: movie.id, score: review.score })),
      watchlist: [],
      watched: [],
    },
    likes: mine.reduce((sum, { review }) => sum + review.likes, 0),
  };
}
