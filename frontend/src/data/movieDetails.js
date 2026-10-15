// ข้อมูลเสริมสำหรับหน้ารายละเอียดหนัง (ข้อมูลจำลอง ยังไม่ต่อ API)

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
export const byReleaseDesc = (a, b) =>
  (MOVIE_DETAILS[b.id]?.releaseDate ?? '').localeCompare(MOVIE_DETAILS[a.id]?.releaseDate ?? '')

const REVIEWERS = [
  { name: 'มินตรา ดูหนังทุกวัน', color: '#00B4D8' },
  { name: 'ต้นกล้า CineClub', color: '#2ECC71' },
  { name: 'Ploy Watcher', color: '#E91E8B' },
  { name: 'ภูมิ ป๊อปคอร์น', color: '#FF6B35' },
  { name: 'แพรวา รีวิวสั้น', color: '#F5C518' },
  { name: 'Nat Film Nerd', color: '#9B59B6' },
]

const REVIEW_POOL = [
  { title: 'คุ้มค่าตั๋วทุกบาท', body: 'งานภาพและดนตรีประกอบทำได้ดีมาก จังหวะเรื่องไม่ยืดเยื้อ ดูจบแล้วยังอยากกลับไปดูซ้ำอีกรอบ', delta: 1 },
  { title: 'ดีแต่ยังไม่สุด', body: 'ครึ่งแรกปูเรื่องนานไปนิด แต่ครึ่งหลังเข้มข้นขึ้นมาก การแสดงของนักแสดงนำช่วยดึงเรื่องไว้ได้', delta: -1 },
  { title: 'ประทับใจตั้งแต่ฉากแรก', body: 'ผู้กำกับคุมโทนได้อยู่หมัด ทุกองค์ประกอบลงตัว เป็นหนึ่งในหนังที่ดีที่สุดของปีสำหรับเรา', delta: 1.5 },
  { title: 'สนุก ดูเพลิน', body: 'ไม่ต้องคิดอะไรมาก ดูเอามันส์ได้เลย เหมาะกับดูกับเพื่อนหรือครอบครัว', delta: 0 },
  { title: 'บทยังมีช่องโหว่', body: 'ชอบงานโปรดักชัน แต่ตอนจบรู้สึกรีบปิดไปหน่อย ตัวละครรองบางตัวไม่ได้พัฒนาเท่าที่ควร', delta: -2 },
  { title: 'ต้องดูในโรงเท่านั้น', body: 'ระบบเสียงในโรงช่วยเพิ่มอรรถรสได้มาก ฉากไคลแมกซ์ทำเอาขนลุกจริงๆ', delta: 0.5 },
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
  const rand = seeded(movie.id)
  const count = 4 + Math.floor(rand() * 3)
  const base = new Date('2026-10-01')
  return Array.from({ length: count }, (_, i) => {
    const tpl = REVIEW_POOL[(i + Math.floor(rand() * REVIEW_POOL.length)) % REVIEW_POOL.length]
    const who = REVIEWERS[(i + Math.floor(rand() * REVIEWERS.length)) % REVIEWERS.length]
    const date = new Date(base)
    date.setDate(base.getDate() - Math.floor(rand() * 120))
    return {
      id: `${movie.id}-m${i}`,
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
