import { useEffect, useState } from 'react'
import GraffitiTitle from '../components/GraffitiTitle'
import CommentWall from '../components/CommentWall'
import VoteBarChart from '../components/VoteBarChart'
import WordCloud from '../components/WordCloud'
import QRCodeBlock from '../components/QRCodeBlock'
import { STAGES, getStage } from '../data/stages'
import { subscribeConfig, subscribeComments, subscribeVotes } from '../lib/data'

const TITLE = '我是你住在成功街還在等待成功的學姊跟她的朋友'

export default function FrontStage() {
  const [config, setConfig] = useState({ currentStageId: 'icebreak', menuQuestionText: '' })
  const [comments, setComments] = useState([])
  const [votes, setVotes] = useState([])

  useEffect(() => subscribeConfig(setConfig), [])

  const stage = getStage(config.currentStageId) || STAGES[0]

  useEffect(() => {
    setComments([])
    setVotes([])
    const unsubComments = subscribeComments(stage.id, setComments)
    const unsubVotes = stage.type === 'vote' ? subscribeVotes(stage.id, setVotes) : () => {}
    return () => {
      unsubComments()
      unsubVotes()
    }
  }, [stage.id, stage.type])

  if (stage.type === 'wordcloud') {
    return (
      <div className="spray-texture" style={{ height: '100vh', background: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem 1rem 0' }}>
          <GraffitiTitle text={stage.question} size="clamp(1.6rem, 5vw, 3.5rem)" />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <WordCloud comments={comments} />
        </div>
      </div>
    )
  }

  const questionText = stage.id === 'menu' ? config.menuQuestionText || '（後台尚未設定題目）' : stage.question

  return (
    <div className="spray-texture" style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1.5rem 1rem 1rem', borderBottom: '4px solid var(--spray)' }}>
        <GraffitiTitle text={TITLE} />
      </header>

      <main
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,0.9fr)',
          gap: '1.5rem',
          padding: '1.5rem',
        }}
      >
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
          <div className="tag-yellow" style={{ display: 'inline-block', padding: '6px 16px', fontFamily: "'Archivo Black', sans-serif", fontSize: 14, alignSelf: 'flex-start', transform: 'skew(-6deg)' }}>
            目前階段
          </div>
          <h2 style={{ margin: 0, fontSize: 'clamp(1.2rem, 2.4vw, 2rem)', color: '#fff' }}>{questionText}</h2>

          {stage.type === 'vote' && <VoteBarChart stage={stage} votes={votes} />}

          <div style={{ marginTop: 'auto' }}>
            <QRCodeBlock />
          </div>
        </section>

        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            background: 'rgba(255,255,255,0.03)',
            border: '2px solid var(--spray)',
            borderRadius: 8,
            padding: '1rem',
          }}
        >
          <div className="tag-black" style={{ display: 'inline-block', padding: '6px 16px', fontFamily: "'Archivo Black', sans-serif", fontSize: 14, alignSelf: 'flex-start', marginBottom: '0.8rem', transform: 'skew(-6deg)' }}>
            留言區
          </div>
          <CommentWall comments={comments} />
        </section>
      </main>
    </div>
  )
}
