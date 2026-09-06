function pseudoRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const SIZES = ['1.6rem', '2.4rem', '3.2rem', '2rem', '2.8rem']
const COLORS = ['var(--spray)', '#ffffff']

export default function WordCloud({ comments }) {
  if (comments.length === 0) {
    return (
      <p style={{ opacity: 0.6, fontStyle: 'italic', textAlign: 'center', fontSize: '1.5rem' }}>
        等待大家留言中…
      </p>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        gap: '1.2rem 2rem',
        height: '100%',
        overflow: 'hidden',
        padding: '2rem',
      }}
    >
      {comments.map((c, i) => {
        const r = pseudoRandom(i + 1)
        const rotate = (pseudoRandom(i + 50) - 0.5) * 16
        const size = SIZES[i % SIZES.length]
        const color = COLORS[i % COLORS.length]
        return (
          <span
            key={c.id}
            style={{
              fontFamily: "'ZCOOL QingKe HuangYou', 'Noto Sans TC', sans-serif",
              fontSize: size,
              color,
              transform: `rotate(${rotate.toFixed(1)}deg)`,
              WebkitTextStroke: color === 'var(--spray)' ? '1px #000' : 'none',
              textShadow: '2px 2px 0 rgba(0,0,0,0.7)',
              whiteSpace: 'nowrap',
              opacity: 0.55 + r * 0.45,
            }}
          >
            {c.text}
          </span>
        )
      })}
    </div>
  )
}
