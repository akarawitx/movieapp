// ข้อมูลจำลองสำหรับหน้าโปรไฟล์และตั้งค่า (ยังไม่ต่อ API)

export const PROFILE_GENRES = [
  { id: 'action', label: 'แอ็คชั่น' },
  { id: 'scifi', label: 'Sci-Fi' },
  { id: 'drama', label: 'ดราม่า' },
  { id: 'horror', label: 'สยองขวัญ' },
  { id: 'comedy', label: 'ตลก' },
  { id: 'romance', label: 'โรแมนติก' },
]

export function createMockProfile(username) {
  return {
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    username,
    email: `${username}@example.com`,
    bio: 'คนรักหนัง Sci-Fi และดราม่า ดูหนังโรงทุกสุดสัปดาห์ 🍿',
    location: 'กรุงเทพมหานคร',
    joinedAt: '2025-03-12',
    avatar: null,
    favoriteGenres: ['scifi', 'drama'],
    privacy: { publicProfile: true, showWatchlist: true },
    notifications: { email: true },
  }
}

export const MOCK_ACTIVITY = {
  reviews: [
    {
      id: 'r1',
      movieId: 'dune2',
      score: 9,
      title: 'งานภาพระดับมหากาพย์',
      body: 'ภาพและเสียงยิ่งใหญ่มาก ควรดูในโรง IMAX อย่างยิ่ง เนื้อเรื่องเข้มข้นกว่าภาคแรก',
      date: '2026-09-28',
    },
    {
      id: 'r2',
      movieId: 'oppenheimer',
      score: 10,
      title: 'Nolan ไม่เคยทำให้ผิดหวัง',
      body: 'การแสดงของ Cillian Murphy ยอดเยี่ยม ฉากทดลองระเบิดคือที่สุด',
      date: '2026-08-14',
    },
    {
      id: 'r3',
      movieId: 'insideo',
      score: 8,
      title: 'อบอุ่นหัวใจ',
      body: 'สนุกได้ทั้งครอบครัว ตัวละคร Anxiety เขียนมาได้ตรงใจมาก',
      date: '2026-07-02',
    },
  ],
  watchlist: ['alien', 'civil', 'deadpool', 'ghostbuster'],
  watched: ['civil'],
  ratings: [
    { movieId: 'dune2', score: 9 },
    { movieId: 'oppenheimer', score: 10 },
    { movieId: 'insideo', score: 8 },
    { movieId: 'godzilla', score: 6 },
    { movieId: 'kungfu4', score: 7 },
  ],
}
