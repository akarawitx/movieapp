import { useState } from 'react'
import { MOVIES, FEATURED_REVIEW } from '../data/movies'
import HeroBanner from '../components/HeroBanner'
import StatsBar from '../components/StatsBar'
import GenreTabs from '../components/GenreTabs'
import MovieCard from '../components/MovieCard'
import MovieDetailModal from '../components/MovieDetailModal'

function SectionHeader({ title, link }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
      <h2 style={{
        fontFamily: "'Prompt', sans-serif", fontSize: '20px', fontWeight: 700,
        display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', margin: 0,
      }}>
        <span style={{ width: '4px', height: '20px', background: '#F5C518', borderRadius: '2px', display: 'block' }} />
        {title}
      </h2>
      <button style={{
        color: '#F5C518', background: 'none', border: 'none',
        fontSize: '13px', fontWeight: 600, cursor: 'pointer',
        fontFamily: "'Prompt', sans-serif",
      }}>ดูทั้งหมด →</button>
    </div>
  )
}

function MovieRow({ movies, onOpen, onWatchlist }) {
  return (
    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
      {movies.map(m => (
        <div key={m.id} style={{ flex: '0 0 175px', minWidth: 0 }}>
          <MovieCard movie={m} onOpen={onOpen} onWatchlist={onWatchlist} />
        </div>
      ))}
    </div>
  )
}

export default function HomePage({ user, onToast, searchQuery }) {
  const [activeGenre, setActiveGenre] = useState('all')
  const [selectedMovie, setSelectedMovie] = useState(null)

  const filtered = searchQuery
    ? MOVIES.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.genreLabel.includes(searchQuery))
    : activeGenre === 'all' ? MOVIES : MOVIES.filter(m => m.genre === activeGenre)

  const topRated  = [...MOVIES].sort((a, b) => b.score - a.score)
  const upcoming  = [...MOVIES].reverse()
  const heroMovie = MOVIES[0]

  const handleWatchlist = (movie) => {
    if (!user) { onToast('กรุณาเข้าสู่ระบบก่อน'); return }
    onToast(`เพิ่ม "${movie.title}" ในรายการแล้ว`)
  }

  // Featured Review
  const featuredMovie = MOVIES.find(m => m.id === FEATURED_REVIEW.movieId)

  return (
    <div>
      <HeroBanner movie={heroMovie} onOpen={setSelectedMovie} onWatchlist={handleWatchlist} />
      <StatsBar />

      {/* Trending */}
      <section id="trending" style={{ padding: '48px 5% 0' }}>
        <GenreTabs active={activeGenre} onChange={setActiveGenre} />
        <SectionHeader title="กำลังฮิตขณะนี้" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '20px' }}>
          {(filtered.length ? filtered : MOVIES).map(m => (
            <MovieCard key={m.id} movie={m} onOpen={setSelectedMovie} onWatchlist={handleWatchlist} />
          ))}
        </div>
      </section>

      {/* Top Rated */}
      <section id="toprated" style={{ padding: '48px 5%' }}>
        <SectionHeader title="คะแนนสูงสุด" />
        <MovieRow movies={topRated} onOpen={setSelectedMovie} onWatchlist={handleWatchlist} />
      </section>

      {/* Featured Review */}
      <section style={{ padding: '0 5% 48px' }}>
        <SectionHeader title="รีวิวแนะนำ" link="อ่านทั้งหมด →" />
        <div style={{
          background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px', padding: '32px',
          display: 'grid', gridTemplateColumns: '140px 1fr', gap: '28px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ aspectRatio: '2/3', borderRadius: '12px', overflow: 'hidden' }}>
            <img src={featuredMovie?.poster} alt={featuredMovie?.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px', fontFamily: "'Prompt', sans-serif" }}>
                {featuredMovie?.title} ({featuredMovie?.year})
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: FEATURED_REVIEW.color, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '16px', color: '#000',
                  fontFamily: "'Prompt', sans-serif", flexShrink: 0,
                }}>{FEATURED_REVIEW.initials}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff', fontFamily: "'Prompt', sans-serif" }}>
                    {FEATURED_REVIEW.reviewer}
                  </div>
                  <span style={{
                    background: 'rgba(245,197,24,0.15)', color: '#F5C518',
                    padding: '2px 8px', borderRadius: '4px', fontSize: '11px',
                    fontWeight: 600, fontFamily: "'Prompt', sans-serif",
                  }}>{FEATURED_REVIEW.badge}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                {[1,2,3,4,5].map(i => (
                  <span key={i} style={{ color: i <= FEATURED_REVIEW.score / 2 ? '#F5C518' : '#2A2A2A', fontSize: '16px' }}>★</span>
                ))}
              </div>
              <p style={{ color: '#aaa', lineHeight: 1.75, fontSize: '14px', fontStyle: 'italic', fontFamily: "'Prompt', sans-serif" }}>
                "{FEATURED_REVIEW.text}"
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              {['❤ ' + FEATURED_REVIEW.likes, 'ความคิดเห็น', 'อ่านต่อ →'].map(btn => (
                <button key={btn} style={{
                  background: '#222', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#aaa', fontSize: '13px', padding: '6px 14px',
                  borderRadius: '8px', cursor: 'pointer',
                  fontFamily: "'Prompt', sans-serif",
                }}>{btn}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming */}
      <section id="upcoming" style={{ padding: '0 5% 64px' }}>
        <SectionHeader title="เร็วๆ นี้" />
        <MovieRow movies={upcoming} onOpen={setSelectedMovie} onWatchlist={handleWatchlist} />
      </section>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          user={user}
          onClose={() => setSelectedMovie(null)}
          onToast={onToast}
        />
      )}
    </div>
  )
}