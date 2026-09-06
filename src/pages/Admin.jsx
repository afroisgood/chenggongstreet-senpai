import { useEffect, useState } from 'react'
import { STAGES, getStage } from '../data/stages'
import VoteBarChart from '../components/VoteBarChart'
import {
  subscribeConfig,
  setCurrentStage,
  setMenuQuestionText,
  subscribeVotes,
  subscribeAllComments,
  deleteComment,
  resetVotes,
} from '../lib/data'

const ADMIN_PASSWORD = 'sean2026'

function AdminLogin({ onSuccess }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('isAdmin', '1')
      onSuccess()
    } else {
      setError('密碼錯誤')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--ink)' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 280 }}>
        <h1 style={{ color: 'var(--spray)', fontFamily: "'Archivo Black', sans-serif", fontSize: '1.4rem', textAlign: 'center' }}>
          管理後台登入
        </h1>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="密碼"
          style={{ padding: '10px 14px', fontSize: 16, border: '3px solid var(--spray)', background: '#111', color: '#fff', textAlign: 'center' }}
        />
        {error && <p style={{ color: '#ff5555', fontSize: 13, textAlign: 'center' }}>{error}</p>}
        <button className="stencil-btn" type="submit">登入</button>
      </form>
    </div>
  )
}

function StageSwitcher({ currentStageId }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {STAGES.map((s) => (
        <button
          key={s.id}
          className={`stencil-btn ${s.id === currentStageId ? 'selected' : ''}`}
          onClick={() => setCurrentStage(s.id)}
          style={{ fontSize: 13, padding: '8px 12px' }}
        >
          {s.name}
        </button>
      ))}
    </div>
  )
}

function MenuQuestionEditor({ current }) {
  const [value, setValue] = useState(current || '')

  useEffect(() => setValue(current || ''), [current])

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="輸入提問靈感菜單題目"
        style={{ flex: 1, minWidth: 220, padding: '10px 14px', border: '2px solid var(--spray)', background: '#111', color: '#fff' }}
      />
      <button className="stencil-btn" onClick={() => setMenuQuestionText(value.trim())}>
        更新題目
      </button>
    </div>
  )
}

function ResetVotesButton({ stage }) {
  const [resetting, setResetting] = useState(false)

  const handleClick = async () => {
    if (!window.confirm(`確定要清除「${stage.name}」的所有投票資料嗎？此動作無法復原。`)) return
    setResetting(true)
    try {
      await resetVotes(stage.id)
    } catch (err) {
      alert(`重置失敗：${err.message}`)
    } finally {
      setResetting(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={resetting}
      style={{ background: '#c0392b', color: '#fff', border: 'none', padding: '8px 14px', cursor: 'pointer', fontSize: 13 }}
    >
      {resetting ? '清除中…' : '重置本題投票'}
    </button>
  )
}

function CommentModeration({ comments }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 420, overflowY: 'auto' }}>
      {comments.length === 0 && <p style={{ opacity: 0.6 }}>目前沒有留言</p>}
      {comments.map((c) => (
        <div
          key={c.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            background: '#111',
            border: '1px solid #333',
            padding: '8px 12px',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, opacity: 0.6 }}>
              {getStage(c.stageId)?.name || c.stageId} · {c.nickname}
            </div>
            <div style={{ wordBreak: 'break-word' }}>{c.text}</div>
          </div>
          <button
            onClick={() => deleteComment(c.id)}
            style={{ background: '#c0392b', color: '#fff', border: 'none', padding: '6px 10px', cursor: 'pointer', flexShrink: 0 }}
          >
            刪除
          </button>
        </div>
      ))}
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('isAdmin') === '1')
  const [config, setConfig] = useState({ currentStageId: 'icebreak', menuQuestionText: '' })
  const [votes, setVotes] = useState([])
  const [comments, setComments] = useState([])

  useEffect(() => {
    if (!authed) return
    const unsubConfig = subscribeConfig(setConfig)
    const unsubComments = subscribeAllComments(setComments)
    return () => {
      unsubConfig()
      unsubComments()
    }
  }, [authed])

  const stage = getStage(config.currentStageId)

  useEffect(() => {
    if (!authed || !stage || stage.type !== 'vote') {
      setVotes([])
      return
    }
    return subscribeVotes(stage.id, setVotes)
  }, [authed, stage?.id, stage?.type])

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)', color: '#fff', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 style={{ color: 'var(--spray)', fontFamily: "'Archivo Black', sans-serif", fontSize: '1.6rem', margin: 0 }}>
        管理後台
      </h1>

      <section>
        <h2 style={{ fontSize: 14, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1 }}>切換活動階段</h2>
        <StageSwitcher currentStageId={config.currentStageId} />
      </section>

      {stage?.id === 'menu' && (
        <section>
          <h2 style={{ fontSize: 14, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1 }}>提問靈感菜單題目</h2>
          <MenuQuestionEditor current={config.menuQuestionText} />
        </section>
      )}

      {stage?.type === 'vote' && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <h2 style={{ fontSize: 14, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>
              即時投票結果：{stage.name}
            </h2>
            <ResetVotesButton stage={stage} />
          </div>
          <VoteBarChart stage={stage} votes={votes} />
        </section>
      )}

      <section>
        <h2 style={{ fontSize: 14, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1 }}>留言管理</h2>
        <CommentModeration comments={comments} />
      </section>
    </div>
  )
}
