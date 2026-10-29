export const normalize = (s) => String(s ?? "").toLowerCase().trim();

// ให้คะแนนความตรงของหนังแต่ละเรื่อง (0 = ไม่ตรงเลย)
function relevance(movie, q) {
  const title = normalize(movie.title);
  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.split(/[\s:&-]+/).some((w) => w.startsWith(q))) return 70;
  if (title.includes(q)) return 60;
  if (normalize(movie.director).includes(q)) return 50;
  if (normalize(movie.cast).includes(q)) return 45;
  if (normalize(movie.genreLabel).includes(q) || normalize(movie.genre) === q) return 40;
  if (String(movie.year) === q) return 30;
  if (normalize(movie.synopsis).includes(q)) return 10;
  return 0;
}

// ทำไมหนังเรื่องนี้ถึงตรงกับคำค้น (ไว้แสดงใต้ชื่อใน dropdown)
export function matchReason(movie, query) {
  const q = normalize(query);
  if (!q || normalize(movie.title).includes(q)) return null;
  if (normalize(movie.director).includes(q)) return `ผู้กำกับ: ${movie.director}`;
  const actor = movie.cast.split(",").find((c) => normalize(c).includes(q));
  if (actor) return `นักแสดง: ${actor.trim()}`;
  return null;
}

// movies มาจาก useCatalog() (เฉพาะเรื่องที่เผยแพร่)
export function searchMovies(movies, query) {
  const q = normalize(query);
  if (!q) return [];
  return movies.map((movie) => ({ movie, rank: relevance(movie, q) }))
    .filter((x) => x.rank > 0)
    .sort((a, b) => b.rank - a.rank || b.movie.score - a.movie.score)
    .map((x) => x.movie);
}

// reviews คือ [{ movie, review }] จาก useCommunityReviews()
export function searchReviews(reviews, query) {
  const q = normalize(query);
  if (!q) return [];
  return reviews
    .filter(
      ({ movie, review: r }) =>
        normalize(movie.title).includes(q) ||
        normalize(r.title).includes(q) ||
        (!r.spoiler && normalize(r.body).includes(q)) ||
        normalize(r.name).includes(q)
    )
    .sort((a, b) => b.review.likes - a.review.likes);
}

// แยกข้อความเป็นส่วน ๆ เพื่อไฮไลต์คำที่ค้น
export function splitHighlight(text, query) {
  const q = query.trim();
  if (!q) return [{ text, hit: false }];
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(text)
    .split(new RegExp(`(${escaped})`, "gi"))
    .filter(Boolean)
    .map((part) => ({ text: part, hit: part.toLowerCase() === q.toLowerCase() }));
}
