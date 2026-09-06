function pseudoRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const COLORS = ['var(--spray)', '#ffffff']

// 依文字長度決定字級：短答案（例如單一詞語）字級大、長句子字級縮小以維持不換行時仍能放得下
function sizeForLength(len) {
  if (len <= 6) return '3.4rem'
  if (len <= 12) return '2.6rem'
  if (len <= 24) return '2rem'
  if (len <= 30) return '1.7rem'
  return '1.4rem'
}

export default function WordCloud({ items }) {
  if (items.length === 0) {
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
        gap: '1.4rem 2.2rem',
        height: '100%',
        overflow: 'hidden',
        padding: '2rem',
      }}
    >
      {items.map((c, i) => {
        const r = pseudoRandom(i + 1)
        const rotate = (pseudoRandom(i + 50) - 0.5) * 12
        const size = sizeForLength(c.text.length)
        const color = COLORS[i % COLORS.length]
        return (
          <span
            key={c.id}
            style={{
              fontFamily: "'ZCOOL KuaiLe', 'Noto Sans TC', sans-serif",
              fontSize: size,
              lineHeight: 1.3,
              color,
              transform: `rotate(${rotate.toFixed(1)}deg)`,
              WebkitTextStroke: color === 'var(--spray)' ? '1px #000' : 'none',
              textShadow: '2px 2px 0 rgba(0,0,0,0.7)',
              whiteSpace: 'nowrap',
              opacity: 0.6 + r * 0.4,
            }}
          >
            {c.text}
          </span>
        )
      })}
    </div>
  )
}
