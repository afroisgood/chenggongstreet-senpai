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
            background: '#fff',
            color: '#201800',
            padding: '9px 13px',
            borderRadius: '4px 16px 16px 16px',
            border: '2px solid #000',
            boxShadow: '3px 3px 0 rgba(0,0,0,0.9)',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontFamily: "'ZCOOL QingKe HuangYou', 'Noto Sans TC', sans-serif",
              fontSize: 11,
              marginBottom: 4,
              padding: '1px 9px',
              borderRadius: 999,
              border: '1.5px solid #000',
              background: 'var(--spray)',
            }}
          >
            {c.nickname || '匿名'}
          </span>
          <div style={{ fontSize: 15, wordBreak: 'break-word' }}>{c.text}</div>
        </div>
      ))}
    </div>
  )
}
