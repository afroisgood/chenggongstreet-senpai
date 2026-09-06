import { useEffect, useRef, useState } from 'react'

function pseudoRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const COLORS = ['var(--spray)', '#ffffff']

// 依文字長度決定「理想」字級（rem）：短答案（例如單一詞語）字級大、長句子字級縮小
function idealRemForLength(len) {
  if (len <= 6) return 3.4
  if (len <= 12) return 2.6
  if (len <= 24) return 2
  if (len <= 30) return 1.7
  return 1.4
}

export default function WordCloud({ items, randomize = true }) {
  const containerRef = useRef(null)
  const [availableWidth, setAvailableWidth] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const style = getComputedStyle(el)
      const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
      setAvailableWidth(el.clientWidth - paddingX)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  if (items.length === 0) {
    return (
      <p style={{ opacity: 0.6, fontStyle: 'italic', textAlign: 'center', fontSize: '1.5rem' }}>
        等待大家留言中…
      </p>
    )
  }

  const rootPx = 16

  return (
    <div
      ref={containerRef}
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
        // 旋轉會讓文字的視覺範圍超出 flex 版位原本保留的空間，可能疊到隔壁行；
        // 固定題目用的清單（randomize=false）不旋轉，避免互相遮擋
        const rotate = randomize ? (pseudoRandom(i + 50) - 0.5) * 12 : 0
        const len = Array.from(c.text).length
        let sizePx = idealRemForLength(len) * rootPx
        if (availableWidth > 0) {
          // 中文字大約跟字級等寬，抓 6% 安全邊距避免貼齊容器邊緣被裁切
          const maxPxByWidth = (availableWidth * 0.94) / len
          sizePx = Math.min(sizePx, maxPxByWidth)
        }
        const color = COLORS[i % COLORS.length]
        return (
          <span
            key={c.id}
            style={{
              fontFamily: "'GenSenRounded', 'Noto Sans TC', sans-serif",
              fontSize: `${sizePx}px`,
              lineHeight: 1.3,
              color,
              transform: `rotate(${rotate.toFixed(1)}deg)`,
              WebkitTextStroke: color === 'var(--spray)' ? '1px #000' : 'none',
              textShadow: '2px 2px 0 rgba(0,0,0,0.7)',
              whiteSpace: 'nowrap',
              opacity: randomize ? 0.6 + r * 0.4 : 1,
            }}
          >
            {c.text}
          </span>
        )
      })}
    </div>
  )
}
