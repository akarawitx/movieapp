import { GENRES, MOVIES } from './movies'
import { MOVIE_DETAILS } from './movieDetails'

// ข้อมูลตั้งต้น: รวม MOVIE_DETAILS เข้าไปในหนังแต่ละเรื่อง → แก้ไขได้ที่เดียวจากหน้าผู้ดูแล
export function seedCatalog() {
  return {
    movies: MOVIES.map((m) => ({
      ...m,
      ...MOVIE_DETAILS[m.id],
      status: 'published',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    })),
    genres: GENRES,
    hiddenReviews: [],
  }
}

// ทำ id จากชื่อหนัง (ภาษาอังกฤษ/ตัวเลข) — ถ้าชื่อเป็นภาษาไทยล้วนจะได้ค่าว่าง ให้ผู้ดูแลกรอกเอง
export const slugify = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)

export const MOVIE_STATUSES = [
  { id: 'published', label: 'เผยแพร่' },
  { id: 'hidden', label: 'ซ่อน' },
]

export const RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'ท', 'น13+', 'น15+', 'น18+', 'ฉ20-']
