import { useEffect, useState } from 'react'
import BubbleTitle from '../components/BubbleTitle'
import CommentWall from '../components/CommentWall'
import VoteBarChart from '../components/VoteBarChart'
import WordCloud from '../components/WordCloud'
import QRCodeBlock from '../components/QRCodeBlock'
import { STAGES, getStage } from '../data/stages'
import { subscribeConfig, subscribeComments, subscribeAllComments, subscribeVotes } from '../lib/data'

const TITLE = '我是你住在成功街還在等待成功的學姊跟她的朋友'

export default function FrontStage() {
  const [config, setConfig] = useState({ currentStageId: 'icebreak' })
  const [comments, setComments] = useState([])
  const [wordcloudComments, setWordcloudComments] = useState([])
  const [votes, setVotes] = useState([])

  useEffect(() => subscribeConfig(setConfig), [])
  // 留言區是全站共用的單一留言牆，不隨階段切換而分開，所以只訂閱一次
  useEffect(() => subscribeAllComments(setComments), [])

  const stage = getStage(config.currentStageId) || STAGES[0]

  useEffect(() => {
    setVotes([])
    setWordcloudComments([])
    const unsubWordcloud = stage.type === 'wordcloud' ? subscribeComments(stage.id, setWordcloudComments) : () => {}
    const unsubVotes = stage.type === 'vote' ? subscribeVotes(stage.id, setVotes) : () => {}
    return () => {
      unsubWordcloud()
      unsubVotes()
    }
  }, [stage.id, stage.type])

  if (stage.type === 'wordcloud') {
    return (
      <div className="spray-texture" style={{ height: '100vh', background: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem 1rem 0' }}>
          <BubbleTitle text={stage.question} size="clamp(1.6rem, 5vw, 3.5rem)" />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <WordCloud items={wordcloudComments} />
        </div>
      </div>
    )
  }

  const questionText = stage.question

  return (
    <div className="spray-texture" style={{ height: '100vh', overflow: 'hidden', background: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          padding: '1.5rem 1rem 1rem',
          borderBottom: '4px solid var(--spray)',
          display: 'grid',
          gridTemplateColumns: '84px 1fr 84px',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div />
        <BubbleTitle text={TITLE} />
        <QRCodeBlock size={64} />
      </header>

      <main
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,0.9fr)',
          gridTemplateRows: 'minmax(0,1fr)',
          gap: '1.5rem',
          padding: '1.5rem',
        }}
      >
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0, minHeight: 0, overflow: 'hidden' }}>
          {stage.type === 'vote' ? (
            <>
              <div className="tag-yellow" style={{ display: 'inline-block', alignSelf: 'flex-start' }}>
                ★ 目前階段
              </div>
              <h2 style={{ margin: 0, fontSize: 'clamp(1.2rem, 2.4vw, 2rem)', color: '#fff' }}>{questionText}</h2>
              {stage.multiSelect && (
                <p style={{ margin: '-0.6rem 0 0', color: 'var(--spray)', fontSize: 13 }}>
                  （可複選）
                </p>
              )}
              <VoteBarChart stage={stage} votes={votes} />
            </>
          ) : stage.type === 'staticCloud' ? (
            <div style={{ flex: 1, minHeight: 0, minWidth: 0, overflow: 'hidden' }}>
              <WordCloud items={stage.items.map((text, i) => ({ id: String(i), text }))} />
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <BubbleTitle text={questionText} size="clamp(2rem, 6vw, 4.5rem)" />
            </div>
          )}
        </section>

        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            minHeight: 0,
            background: 'rgba(255,255,255,0.04)',
            border: '2px solid var(--spray)',
            borderRadius: 20,
            padding: '1rem',
          }}
        >
          <div className="tag-black" style={{ display: 'inline-block', alignSelf: 'flex-start', marginBottom: '0.8rem' }}>
            ♡ 留言區
          </div>
          <CommentWall comments={comments} />
        </section>
      </main>
    </div>
  )
}
