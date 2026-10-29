import { useCatalog } from "../context/CatalogContext";
import { useAccounts } from "../context/AccountsContext";
import { useProfile } from "../context/ProfileContext";
import { getMovieReviews, getReviewer } from "../data/movieDetails";
import { buildReviewerProfile } from "./useCommunityReviews";

const fullName = (p) => `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || p.username;

// รวมข้อมูลทุกบัญชีและทุกรีวิวสำหรับหน้าผู้ดูแล (รวมหนังที่ซ่อนและรีวิวที่ถูกซ่อนด้วย)
export default function useAdminData() {
  const { allMovies, hiddenReviews } = useCatalog();
  const { accounts } = useAccounts();
  const { getUserData } = useProfile();

  const movieById = Object.fromEntries(allMovies.map((m) => [m.id, m]));
  const communityAll = allMovies.flatMap((movie) =>
    getMovieReviews(movie).map((review) => ({ movie, review }))
  );

  const users = Object.values(accounts).map((account) => {
    const reviewer = account.community ? getReviewer(account.username) : null;
    const { profile, activity } = reviewer
      ? buildReviewerProfile(reviewer, communityAll)
      : getUserData(account.username);
    const watchlist = activity.watchlist.filter((id) => movieById[id]);
    const reviews = activity.reviews.filter((r) => movieById[r.movieId]);
    return {
      account,
      profile,
      activity,
      name: fullName(profile),
      community: !!reviewer,
      reviewCount: reviews.length,
      watchlistCount: watchlist.length,
    };
  });

  const reviews = [
    ...communityAll.map(({ movie, review }) => ({
      key: review.id,
      kind: "community",
      movie,
      review,
      author: { username: review.username, name: review.name, color: review.color },
      hidden: hiddenReviews.includes(review.id),
      authorStatus: accounts[review.username]?.status ?? "deleted",
    })),
    ...users
      .filter((u) => !u.community)
      .flatMap((u) =>
        u.activity.reviews
          .filter((r) => movieById[r.movieId])
          .map((r) => ({
            key: `${u.account.username}:${r.movieId}`,
            kind: "user",
            movie: movieById[r.movieId],
            review: { ...r, likes: 0 },
            author: { username: u.account.username, name: u.name, avatar: u.profile.avatar },
            hidden: false,
            authorStatus: u.account.status,
          }))
      ),
  ];

  return { users, reviews, movieById };
}
