export default function CommentWall({ comments, emptyText = '還沒有留言，等你來說話！' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', flex: 1 }}>
      {comments.length === 0 && (
        <p style={{ opacity: 0.6, fontStyle: 'italic' }}>{emptyText}</p>
      )}
      {comments.map((c) => (
        <div
          key={c.id}
          style={{
            background: 'var(--spray)',
            color: 'var(--ink)',
            padding: '10px 14px',
            borderRadius: '2px 14px 14px 14px',
            transform: 'skew(-1deg)',
            boxShadow: '3px 3px 0 rgba(0,0,0,0.6)',
          }}
        >
          <div
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: 12,
              marginBottom: 4,
              opacity: 0.75,
            }}
          >
            {c.nickname || '匿名'}
          </div>
          <div style={{ fontSize: 15, wordBreak: 'break-word' }}>{c.text}</div>
        </div>
      ))}
    </div>
  )
}
