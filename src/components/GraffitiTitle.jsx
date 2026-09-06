// 產生穩定但看起來隨機的角度/位移，讓每個字有手噴漆的錯落感
function pseudoRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

export default function GraffitiTitle({ text, size = 'clamp(1.4rem, 4.2vw, 3.2rem)' }) {
  const chars = Array.from(text)
  return (
    <h1
      style={{
        margin: 0,
        fontFamily: "'Noto Sans TC', sans-serif",
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.35,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.05em',
        padding: '0 0.4em',
      }}
    >
      {chars.map((ch, i) => {
        const r = pseudoRandom(i)
        const rotate = (r - 0.5) * 10
        const rise = pseudoRandom(i + 100) * 6 - 3
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `rotate(${rotate.toFixed(1)}deg) translateY(${rise.toFixed(1)}px)`,
              color: 'var(--spray)',
              WebkitTextStroke: '1.5px var(--ink)',
              textShadow: '3px 3px 0 var(--ink), -1px -1px 0 var(--ink)',
              whiteSpace: 'pre',
            }}
          >
            {ch}
          </span>
        )
      })}
    </h1>
  )
}
