import { useLayoutEffect, useRef, useState } from 'react'

const MIN_FONT_PX = 12
const MAX_FONT_PX = 32
const HEADER_FONT_PX = 18

export default function VoteBarChart({ stage, votes, optionFontSize = 18, autoFit = false }) {
  const containerRef = useRef(null)
  const [autoFontSize, setAutoFontSize] = useState(MAX_FONT_PX)

  // autoFit：直接操作容器的 font-size 並量測實際渲染高度（含中文長標籤的自動換行），
  // 用二分搜尋找出「剛好塞得進容器、不必捲動」的最大字級，取代不準確的公式估算。
  // 用 useLayoutEffect 而非 useEffect，讓瀏覽器在畫面畫出來之前就先套用好正確字級，不會閃一下。
  useLayoutEffect(() => {
    if (!autoFit) return
    const el = containerRef.current
    if (!el) return

    const fits = (px) => {
      el.style.fontSize = `${px}px`
      return el.scrollHeight <= el.clientHeight
    }

    const measure = () => {
      if (fits(MAX_FONT_PX)) {
        setAutoFontSize(MAX_FONT_PX)
        return
      }
      if (!fits(MIN_FONT_PX)) {
        setAutoFontSize(MIN_FONT_PX)
        return
      }
      let lo = MIN_FONT_PX
      let hi = MAX_FONT_PX
      for (let i = 0; i < 10; i++) {
        const mid = (lo + hi) / 2
        if (fits(mid)) lo = mid
        else hi = mid
      }
      setAutoFontSize(lo)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    // 自訂字體（GenSenRounded）是非同步載入的，量測當下如果還沒套用字體，換行位置會用
    // fallback 字體的字寬計算，字體套用後文字寬度一變就可能跟量測結果對不上；字體載入
    // 完成後要再量一次，確保最後套用的字級真的不會讓內容超出容器。
    document.fonts?.ready?.then(measure)
    return () => ro.disconnect()
  }, [autoFit, stage.id, stage.options.length])

  const counts = Object.fromEntries(stage.options.map((o) => [o.id, 0]))
  votes.forEach((v) => {
    ;(v.options || []).forEach((optId) => {
      if (optId in counts) counts[optId] += 1
    })
  })
  const totalVoters = votes.length
  const maxCount = Math.max(1, ...Object.values(counts))

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: autoFit ? '0.4em' : 13,
        fontSize: autoFit ? autoFontSize : undefined,
        height: autoFit ? '100%' : undefined,
        overflow: 'hidden',
      }}
    >
      <p style={{ fontFamily: "'GenSenRounded', 'Noto Sans TC', sans-serif", color: 'var(--spray)', margin: 0, fontSize: HEADER_FONT_PX }}>
        已投票人數：{totalVoters}
      </p>
      {stage.options.map((opt) => {
        const count = counts[opt.id]
        const pct = Math.round((count / maxCount) * 100)
        return (
          <div key={opt.id}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: autoFit ? undefined : optionFontSize,
                marginBottom: autoFit ? '0.3em' : 5,
              }}
            >
              <span>
                <strong>{opt.id}.</strong> {opt.label}
              </span>
              <span style={{ fontFamily: "'GenSenRounded', 'Noto Sans TC', sans-serif", flexShrink: 0, marginLeft: 8 }}>
                {count}
              </span>
            </div>
            <div
              style={{
                background: '#1c1c1c',
                height: autoFit ? '0.5em' : 16,
                borderRadius: 999,
                border: '1px solid var(--line)',
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: 'var(--spray)',
                  position: 'relative',
                  transition: 'width 0.4s ease',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: '2px 2px auto 2px',
                    height: '35%',
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: '999px 999px 0 0',
                  }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
