// ข้อมูลเสริมสำหรับหน้ารายละเอียดหนัง (ข้อมูลจำลอง ยังไม่ต่อ API)
// MOVIE_DETAILS ใช้ seed ครั้งแรกเท่านั้น — CatalogContext รวม field เหล่านี้เข้าไปในตัวหนังแต่ละเรื่อง

export const MOVIE_DETAILS = {
  dune2: { releaseDate: '2024-03-01', rated: 'PG-13', language: 'อังกฤษ', country: 'สหรัฐอเมริกา', studio: 'Legendary Pictures' },
  oppenheimer: { releaseDate: '2023-07-21', rated: 'R', language: 'อังกฤษ', country: 'สหรัฐอเมริกา, สหราชอาณาจักร', studio: 'Universal Pictures' },
  godzilla: { releaseDate: '2024-03-29', rated: 'PG-13', language: 'อังกฤษ', country: 'สหรัฐอเมริกา', studio: 'Legendary Pictures' },
  kungfu4: { releaseDate: '2024-03-08', rated: 'PG', language: 'อังกฤษ', country: 'สหรัฐอเมริกา', studio: 'DreamWorks Animation' },
  alien: { releaseDate: '2024-08-16', rated: 'R', language: 'อังกฤษ', country: 'สหรัฐอเมริกา', studio: '20th Century Studios' },
  civil: { releaseDate: '2024-04-12', rated: 'R', language: 'อังกฤษ', country: 'สหรัฐอเมริกา, สหราชอาณาจักร', studio: 'A24' },
  insideo: { releaseDate: '2024-06-14', rated: 'PG', language: 'อังกฤษ', country: 'สหรัฐอเมริกา', studio: 'Pixar Animation Studios' },
  deadpool: { releaseDate: '2024-07-26', rated: 'R', language: 'อังกฤษ', country: 'สหรัฐอเมริกา', studio: 'Marvel Studios' },
  ghostbuster: { releaseDate: '2024-03-22', rated: 'PG-13', language: 'อังกฤษ', country: 'สหรัฐอเมริกา', studio: 'Columbia Pictures' },
}

// เรียงหนังตามวันเข้าฉาย ใหม่สุดก่อน (ใช้กับโซน/ตัวเรียง "เร็วๆ นี้" จนกว่าจะมีหนังที่ยังไม่เข้าฉายในข้อมูล)
export const byReleaseDesc = (a, b) => (b.releaseDate ?? '').localeCompare(a.releaseDate ?? '')

// นักรีวิวจำลอง (มีหน้าโปรไฟล์สาธารณะที่ /u/:username)
export const REVIEWERS = [
  { username: 'mintra', name: 'มินตรา ดูหนังทุกวัน', color: '#00B4D8', bio: 'ดูหนังวันละเรื่องเป็นอย่างน้อย ชอบหนังที่เล่าเรื่องผ่านภาพ', location: 'เชียงใหม่', joinedAt: '2024-11-02', favoriteGenres: ['drama', 'scifi'] },
  { username: 'tonkla_cine', name: 'ต้นกล้า CineClub', color: '#2ECC71', bio: 'แอดมินชมรมหนังมหาวิทยาลัย รีวิวแบบไม่สปอยล์ (เกือบทุกครั้ง)', location: 'กรุงเทพมหานคร', joinedAt: '2023-06-18', favoriteGenres: ['action', 'drama'] },
  { username: 'ploywatcher', name: 'Ploy Watcher', color: '#E91E8B', bio: 'สายแอนิเมชันและหนังครอบครัว ร้องไห้ง่ายเป็นพิเศษ', location: 'ขอนแก่น', joinedAt: '2025-01-09', favoriteGenres: ['comedy', 'romance'] },
  { username: 'phum_popcorn', name: 'ภูมิ ป๊อปคอร์น', color: '#FF6B35', bio: 'ป๊อปคอร์นต้องรสเนย ที่นั่งต้องแถวกลาง หนังต้องมันส์', location: 'ชลบุรี', joinedAt: '2024-03-27', favoriteGenres: ['action', 'horror'] },
  { username: 'praewa', name: 'แพรวา รีวิวสั้น', color: '#F5C518', bio: 'รีวิวสั้น กระชับ จบในสามบรรทัด', location: 'กรุงเทพมหานคร', joinedAt: '2025-05-14', favoriteGenres: ['drama'] },
  { username: 'natfilmnerd', name: 'Nat Film Nerd', color: '#9B59B6', bio: 'Film nerd. เก็บสถิติหนังที่ดูทุกเรื่องลง spreadsheet', location: 'ภูเก็ต', joinedAt: '2023-09-30', favoriteGenres: ['scifi', 'horror'] },
]

export const getReviewer = (username) => REVIEWERS.find((r) => r.username === username)

const REVIEW_POOL = [
  { title: 'คุ้มค่าตั๋วทุกบาท', body: 'งานภาพและดนตรีประกอบทำได้ดีมาก จังหวะเรื่องไม่ยืดเยื้อ ดูจบแล้วยังอยากกลับไปดูซ้ำอีกรอบ', delta: 1 },
  { title: 'ดีแต่ยังไม่สุด', body: 'ครึ่งแรกปูเรื่องนานไปนิด แต่ครึ่งหลังเข้มข้นขึ้นมาก การแสดงของนักแสดงนำช่วยดึงเรื่องไว้ได้', delta: -1 },
  { title: 'ประทับใจตั้งแต่ฉากแรก', body: 'ผู้กำกับคุมโทนได้อยู่หมัด ทุกองค์ประกอบลงตัว เป็นหนึ่งในหนังที่ดีที่สุดของปีสำหรับเรา', delta: 1.5 },
  { title: 'สนุก ดูเพลิน', body: 'ไม่ต้องคิดอะไรมาก ดูเอามันส์ได้เลย เหมาะกับดูกับเพื่อนหรือครอบครัว', delta: 0 },
  { title: 'บทยังมีช่องโหว่', body: 'ชอบงานโปรดักชัน แต่ตอนจบรู้สึกรีบปิดไปหน่อย ตัวละครรองบางตัวไม่ได้พัฒนาเท่าที่ควร', delta: -2 },
  { title: 'ต้องดูในโรงเท่านั้น', body: 'ระบบเสียงในโรงช่วยเพิ่มอรรถรสได้มาก ฉากไคลแมกซ์ทำเอาขนลุกจริงๆ', delta: 0.5 },
  { title: 'นักแสดงคือจุดแข็ง', body: 'เคมีของนักแสดงนำเข้ากันดีมาก ทำให้ฉากดราม่าเล็กๆ มีน้ำหนักกว่าที่คิด', delta: 0.5 },
  { title: 'ยาวไปหน่อย', body: 'เนื้อหาดีแต่ตัดให้กระชับกว่านี้ได้อีกนิด ช่วงกลางเรื่องมีจังหวะยืดอยู่บ้าง', delta: -1.5 },
  { title: 'ดูซ้ำได้เรื่อยๆ', body: 'ดูรอบสองแล้วเจอรายละเอียดใหม่ที่ไม่ทันสังเกตรอบแรก ชอบที่ใส่ใจทุกองค์ประกอบ', delta: 1 },
  { title: 'ภาพสวยแต่เรื่องเบา', body: 'งานภาพกับซีจีทำได้ระดับโลก แต่เนื้อเรื่องเดาทางได้ตั้งแต่ครึ่งแรก', delta: -1 },
  { title: 'เพลงประกอบติดหู', body: 'สกอร์ดนตรีเข้ากับอารมณ์ทุกฉาก ออกจากโรงแล้วยังฮัมตามอยู่เลย', delta: 0.5 },
  { title: 'เกินความคาดหมาย', body: 'เข้าไปแบบไม่ได้คาดหวังอะไร ออกมาประทับใจกว่าที่คิดไว้เยอะ แนะนำเลย', delta: 1 },
]

// สร้างตัวเลขสุ่มแบบคงที่จาก id หนัง (เปิดกี่ครั้งก็ได้ข้อมูลเหมือนเดิม)
function seeded(str) {
  let h = 2166136261
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

const clampScore = (n) => Math.min(10, Math.max(1, Math.round(n)))

export function getMovieReviews(movie) {
  // หนังที่เพิ่งเพิ่มโดยผู้ดูแล (ยังไม่มีรีวิว) ไม่ต้องสร้างรีวิวจำลอง
  if (!movie.reviews) return []
  const rand = seeded(movie.id)
  const count = 4 + Math.floor(rand() * 3)
  const base = new Date('2026-10-01')
  // เลื่อนจุดเริ่มแบบสุ่มแล้วไล่ตามลำดับ → นักรีวิวแต่ละคนรีวิวหนังเรื่องเดียวกันได้ครั้งเดียว
  const offset = Math.floor(rand() * REVIEWERS.length)
  return Array.from({ length: count }, (_, i) => {
    const tpl = REVIEW_POOL[(i + Math.floor(rand() * REVIEW_POOL.length)) % REVIEW_POOL.length]
    const who = REVIEWERS[(offset + i) % REVIEWERS.length]
    const date = new Date(base)
    date.setDate(base.getDate() - Math.floor(rand() * 120))
    return {
      id: `${movie.id}-m${i}`,
      username: who.username,
      name: who.name,
      color: who.color,
      score: clampScore(movie.score + tpl.delta),
      title: tpl.title,
      body: tpl.body,
      spoiler: i === 2,
      likes: Math.floor(rand() * 400),
      date: date.toISOString().slice(0, 10),
    }
  })
}

// สัดส่วนคะแนน 5 ช่วง (9–10, 7–8, 5–6, 3–4, 1–2) อิงจากคะแนนเฉลี่ยของหนัง
export function getRatingDistribution(movie) {
  const buckets = [9.5, 7.5, 5.5, 3.5, 1.5].map((center) =>
    Math.exp(-((center - movie.score) ** 2) / 4.5)
  )
  const sum = buckets.reduce((a, b) => a + b, 0)
  return buckets.map((b, i) => ({
    label: ['9–10', '7–8', '5–6', '3–4', '1–2'][i],
    percent: Math.round((b / sum) * 100),
  }))
}
