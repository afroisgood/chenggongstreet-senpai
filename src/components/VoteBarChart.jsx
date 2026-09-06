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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <p style={{ fontFamily: "'GenSenRounded', 'Noto Sans TC', sans-serif", color: 'var(--spray)', margin: 0, fontSize: 14 }}>
        已投票人數：{totalVoters}
      </p>
      {stage.options.map((opt) => {
        const count = counts[opt.id]
        const pct = Math.round((count / maxCount) * 100)
        return (
          <div key={opt.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 5 }}>
              <span>
                <strong>{opt.id}.</strong> {opt.label}
              </span>
              <span style={{ fontFamily: "'GenSenRounded', 'Noto Sans TC', sans-serif", flexShrink: 0, marginLeft: 8 }}>
                {count}
              </span>
            </div>
            <div style={{ background: '#1c1c1c', height: 16, borderRadius: 999, border: '2px solid rgba(255,255,255,0.12)' }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: 'linear-gradient(180deg, #FFF3A3 0%, var(--spray) 55%, #E6CE00 100%)',
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
