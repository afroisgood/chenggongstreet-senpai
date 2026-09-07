import { useEffect, useState } from 'react'
import { useParticipant } from '../context/ParticipantContext'
import { getStage, STAGES } from '../data/stages'
import { subscribeConfig, postComment, submitVote, subscribeMyVote } from '../lib/data'

function NicknameGate({ onSubmit }) {
  const [value, setValue] = useState('')
  return (
    <div className="spray-texture" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20, padding: 24, background: 'var(--ink)' }}>
      <h1 style={{ color: 'var(--spray)', WebkitTextStroke: '1.2px #000', paintOrder: 'stroke fill', fontSize: '1.8rem', textAlign: 'center' }}>
        先取一個暱稱
      </h1>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={20}
        placeholder="輸入暱稱"
        style={{
          fontSize: 18,
          padding: '12px 16px',
          border: '3px solid var(--spray)',
          borderRadius: 14,
          background: '#111',
          color: '#fff',
          width: '100%',
          maxWidth: 320,
          textAlign: 'center',
        }}
      />
      <button
        className="stencil-btn"
        disabled={!value.trim()}
        onClick={() => onSubmit(value.trim())}
      >
        進入活動
      </button>
    </div>
  )
}

export default function Interactive() {
  const { nickname, setNickname, participantId } = useParticipant()
  const [config, setConfig] = useState({ currentStageId: 'icebreak' })
  const [selected, setSelected] = useState([])
  const [myVote, setMyVote] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [status, setStatus] = useState(null) // { type: 'success' | 'error', text: string }
  const [submittingVote, setSubmittingVote] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => subscribeConfig(setConfig), [])

  // 送出成功/失敗的提示訊息幾秒後自動消失,避免一直卡在畫面上
  useEffect(() => {
    if (!status) return
    const timer = setTimeout(() => setStatus(null), 3000)
    return () => clearTimeout(timer)
  }, [status])

  const stage = getStage(config.currentStageId) || STAGES[0]

  useEffect(() => {
    setStatus(null)
    if (stage.type !== 'vote') {
      setMyVote(null)
      return
    }
    // Firestore 的 onSnapshot 常會先給一次本地快取、再給一次伺服器確認，即使資料沒變也會
    // 觸發兩次。只有在票的內容「真的變了」（含首次載入、或後台重置投票）才覆蓋 selected，
    // 避免把使用者正在修改、還沒送出的選擇蓋掉。
    let previousOptionsKey = undefined
    return subscribeMyVote(stage.id, participantId, (vote) => {
      const optionsKey = JSON.stringify(vote?.options || null)
      if (optionsKey !== previousOptionsKey) {
        setSelected(vote?.options || [])
      }
      previousOptionsKey = optionsKey
      setMyVote(vote)
    })
  }, [stage.id, stage.type, participantId])

  if (!nickname) {
    return <NicknameGate onSubmit={setNickname} />
  }

  const questionText = stage.question

  const toggleOption = (optId) => {
    if (stage.multiSelect) {
      setSelected((prev) => (prev.includes(optId) ? prev.filter((o) => o !== optId) : [...prev, optId]))
    } else {
      setSelected([optId])
    }
  }

  const handleVoteSubmit = async () => {
    if (selected.length === 0 || submittingVote) return
    setSubmittingVote(true)
    try {
      await submitVote({ stageId: stage.id, participantId, nickname, options: selected })
      setStatus({ type: 'success', text: myVote ? '已更新你的投票！' : '已送出你的投票！' })
    } catch (err) {
      setStatus({ type: 'error', text: `送出失敗,請再試一次(${err.message})` })
    } finally {
      setSubmittingVote(false)
    }
  }

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || submittingComment) return
    setSubmittingComment(true)
    try {
      await postComment({ stageId: stage.id, nickname, text: commentText })
      setCommentText('')
      setStatus({ type: 'success', text: '留言送出囉！' })
    } catch (err) {
      setStatus({ type: 'error', text: `留言送出失敗,請再試一次(${err.message})` })
    } finally {
      setSubmittingComment(false)
    }
  }

  return (
    <div className="spray-texture" style={{ minHeight: '100vh', background: 'var(--ink)', color: '#fff', padding: '1.5rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="tag-yellow" style={{ display: 'inline-block' }}>
          {nickname}
        </span>
        <span style={{ fontSize: 13, opacity: 0.7 }}>{stage.name}</span>
      </header>

      {questionText && <h2 style={{ margin: 0, fontSize: '1.3rem', lineHeight: 1.5 }}>{questionText}</h2>}
      {stage.type === 'vote' && stage.multiSelect && (
        <p style={{ margin: '-0.8rem 0 0', color: 'var(--spray)', fontSize: 13 }}>
          （可複選，投票後仍可修改）
        </p>
      )}

      {stage.type === 'vote' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stage.options.map((opt) => (
            <button
              key={opt.id}
              className={`stencil-btn ${selected.includes(opt.id) ? 'selected' : ''}`}
              onClick={() => toggleOption(opt.id)}
              style={{ textAlign: 'left' }}
            >
              {opt.id}. {opt.label}
            </button>
          ))}
          <button className="stencil-btn" disabled={selected.length === 0 || submittingVote} onClick={handleVoteSubmit}>
            {submittingVote ? '送出中…' : myVote ? '更新投票' : stage.multiSelect ? '送出（可複選）' : '送出'}
          </button>
        </div>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value.slice(0, 100))}
          placeholder="在這裡留言…（最多 100 字）"
          rows={3}
          style={{
            background: '#111',
            color: '#fff',
            border: '3px solid var(--spray)',
            borderRadius: 14,
            padding: '10px 12px',
            fontSize: 15,
            resize: 'none',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, opacity: 0.6 }}>{commentText.length}/100</span>
          <button className="stencil-btn" disabled={!commentText.trim() || submittingComment} onClick={handleCommentSubmit}>
            {submittingComment ? '送出中…' : '送出留言'}
          </button>
        </div>
        {status && (
          <p style={{ color: status.type === 'error' ? '#ff5555' : 'var(--spray)', fontSize: 13 }}>{status.text}</p>
        )}
      </div>
    </div>
  )
}
