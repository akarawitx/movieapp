import { useCatalog } from '../context/CatalogContext'
import styles from '../css/components/GenreTabs.module.css'

// แสดงเฉพาะแนวที่มีหนังเผยแพร่อยู่
export default function GenreTabs({ active, onChange }) {
  const { genres, movies } = useCatalog()
  const GENRES = [
    { id: 'all', label: 'ทั้งหมด' },
    ...genres.filter((g) => movies.some((m) => m.genre === g.id)),
  ]
  return (
    <div className={styles.tabs}>
      {GENRES.map(g => (
        <button
          key={g.id}
          onClick={() => onChange(g.id)}
          className={`${styles.tab} ${active === g.id ? styles.active : ''}`}
        >{g.label}</button>
      ))}
    </div>
  )
}