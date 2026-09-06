import { useEffect, useState } from 'react'
import { useParticipant } from '../context/ParticipantContext'
import { getStage, STAGES } from '../data/stages'
import { subscribeConfig, postComment, submitVote } from '../lib/data'

function NicknameGate({ onSubmit }) {
  const [value, setValue] = useState('')
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20, padding: 24, background: 'var(--ink)' }}>
      <h1 style={{ color: 'var(--spray)', fontFamily: "'Archivo Black', sans-serif", fontSize: '1.6rem', textAlign: 'center' }}>
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
  const { nickname, setNickname, participantId, votedStages, markVoted } = useParticipant()
  const [config, setConfig] = useState({ currentStageId: 'icebreak', menuQuestionText: '' })
  const [selected, setSelected] = useState([])
  const [commentText, setCommentText] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => subscribeConfig(setConfig), [])

  const stage = getStage(config.currentStageId) || STAGES[0]

  useEffect(() => {
    setSelected([])
    setStatus('')
  }, [stage.id])

  if (!nickname) {
    return <NicknameGate onSubmit={setNickname} />
  }

  const questionText = stage.id === 'menu' ? config.menuQuestionText || '主持人準備中…' : stage.question
  const hasVoted = !!votedStages[stage.id]

  const toggleOption = (optId) => {
    if (stage.multiSelect) {
      setSelected((prev) => (prev.includes(optId) ? prev.filter((o) => o !== optId) : [...prev, optId]))
    } else {
      setSelected([optId])
    }
  }

  const handleVoteSubmit = async () => {
    if (selected.length === 0) return
    await submitVote({ stageId: stage.id, participantId, nickname, options: selected })
    markVoted(stage.id)
    setStatus('已送出你的投票！')
  }

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return
    await postComment({ stageId: stage.id, nickname, text: commentText })
    setCommentText('')
    setStatus('留言送出囉！')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)', color: '#fff', padding: '1.5rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="tag-yellow" style={{ padding: '4px 12px', fontFamily: "'Archivo Black', sans-serif", fontSize: 13, transform: 'skew(-6deg)', display: 'inline-block' }}>
          {nickname}
        </span>
        <span style={{ fontSize: 13, opacity: 0.7 }}>{stage.name}</span>
      </header>

      <h2 style={{ margin: 0, fontSize: '1.3rem', lineHeight: 1.5 }}>{questionText}</h2>

      {stage.type === 'vote' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stage.options.map((opt) => (
            <button
              key={opt.id}
              className={`stencil-btn ${selected.includes(opt.id) ? 'selected' : ''}`}
              disabled={hasVoted}
              onClick={() => toggleOption(opt.id)}
              style={{ textAlign: 'left' }}
            >
              {opt.id}. {opt.label}
            </button>
          ))}
          <button className="stencil-btn" disabled={hasVoted || selected.length === 0} onClick={handleVoteSubmit}>
            {hasVoted ? '已投票' : stage.multiSelect ? '送出（可複選）' : '送出'}
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
            padding: '10px 12px',
            fontSize: 15,
            resize: 'none',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, opacity: 0.6 }}>{commentText.length}/100</span>
          <button className="stencil-btn" disabled={!commentText.trim()} onClick={handleCommentSubmit}>
            送出留言
          </button>
        </div>
        {status && <p style={{ color: 'var(--spray)', fontSize: 13 }}>{status}</p>}
      </div>
    </div>
  )
}
