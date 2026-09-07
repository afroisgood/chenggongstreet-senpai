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
        className="stencil-btn primary-action"
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
    <div className="spray-texture interactive-page">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="tag-yellow" style={{ display: 'inline-block' }}>
          {nickname}
        </span>
        <span style={{ fontSize: 13, opacity: 0.7 }}>{stage.name}</span>
      </header>

      {questionText && <h2 style={{ margin: 0, fontSize: '1.3rem', lineHeight: 1.5 }}>{questionText}</h2>}
      {stage.type === 'vote' && stage.multiSelect && (
        <div className="vote-meta" aria-live="polite">
          <span>可複選</span>
          <strong>已選 {selected.length} 項</strong>
        </div>
      )}

      {stage.type === 'vote' && (
        <section className="vote-panel" aria-label={stage.question}>
          {stage.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`vote-option ${selected.includes(opt.id) ? 'selected' : ''}`}
              onClick={() => toggleOption(opt.id)}
              aria-pressed={selected.includes(opt.id)}
            >
              <span className="vote-checkbox" aria-hidden="true">
                {selected.includes(opt.id) ? '✓' : ''}
              </span>
              <span className="vote-option-label">
                <strong>{opt.id}.</strong> {opt.label}
              </span>
            </button>
          ))}
          <button className="stencil-btn primary-action vote-submit" disabled={selected.length === 0 || submittingVote} onClick={handleVoteSubmit}>
            {submittingVote ? '送出中…' : myVote ? '更新投票' : '送出投票'}
          </button>
          {myVote && <p className="saved-vote-status">✓ 已送出，仍可修改選項</p>}
        </section>
      )}

      <section className="comment-card">
        <div className="comment-card-heading">
          <div>
            <span className="section-kicker">現場留言</span>
            <h3>想說點什麼？</h3>
          </div>
          <span className="comment-counter">{commentText.length}/100</span>
        </div>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value.slice(0, 100))}
          placeholder="在這裡留言…（最多 100 字）"
          rows={3}
          className="comment-input"
        />
        <div className="comment-actions">
          <span>留言會顯示在現場大螢幕</span>
          <button className="stencil-btn primary-action" disabled={!commentText.trim() || submittingComment} onClick={handleCommentSubmit}>
            {submittingComment ? '送出中…' : '送出留言'}
          </button>
        </div>
        {status && (
          <p style={{ color: status.type === 'error' ? '#ff5555' : 'var(--spray)', fontSize: 13 }}>{status.text}</p>
        )}
      </section>
    </div>
  )
}
