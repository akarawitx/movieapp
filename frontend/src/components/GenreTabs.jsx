import styles from '../css/components/GenreTabs.module.css'

const GENRES = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'action', label: 'แอ็คชั่น' },
  { id: 'scifi', label: 'Sci-Fi' },
  { id: 'drama', label: 'ดราม่า' },
  { id: 'horror', label: 'สยองขวัญ' },
  { id: 'comedy', label: 'ตลก' },
  { id: 'romance', label: 'โรแมนติก' },
]

export default function GenreTabs({ active, onChange }) {
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