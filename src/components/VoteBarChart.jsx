export default function VoteBarChart({ stage, votes }) {
  const counts = Object.fromEntries(stage.options.map((o) => [o.id, 0]))
  votes.forEach((v) => {
    ;(v.options || []).forEach((optId) => {
      if (optId in counts) counts[optId] += 1
    })
  })
  const totalVoters = votes.length
  const maxCount = Math.max(1, ...Object.values(counts))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontFamily: "'Archivo Black', sans-serif", color: 'var(--spray)', margin: 0 }}>
        已投票人數：{totalVoters}
      </p>
      {stage.options.map((opt) => {
        const count = counts[opt.id]
        const pct = Math.round((count / maxCount) * 100)
        return (
          <div key={opt.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
              <span>
                <strong>{opt.id}.</strong> {opt.label}
              </span>
              <span style={{ fontFamily: "'Archivo Black', sans-serif", flexShrink: 0, marginLeft: 8 }}>
                {count}
              </span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', height: 16, border: '2px solid #000' }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: 'var(--spray)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
