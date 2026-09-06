import { createContext, useContext, useState, useCallback } from 'react'

const ParticipantContext = createContext(null)

function getOrCreateParticipantId() {
  let id = localStorage.getItem('participantId')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('participantId', id)
  }
  return id
}

export function ParticipantProvider({ children }) {
  const [nickname, setNicknameState] = useState(() => localStorage.getItem('nickname') || '')
  const [participantId] = useState(getOrCreateParticipantId)
  const [votedStages, setVotedStages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('votedStages') || '{}')
    } catch {
      return {}
    }
  })

  const setNickname = useCallback((name) => {
    localStorage.setItem('nickname', name)
    setNicknameState(name)
  }, [])

  const markVoted = useCallback((stageId) => {
    setVotedStages((prev) => {
      const next = { ...prev, [stageId]: true }
      localStorage.setItem('votedStages', JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <ParticipantContext.Provider
      value={{ nickname, setNickname, participantId, votedStages, markVoted }}
    >
      {children}
    </ParticipantContext.Provider>
  )
}

export function useParticipant() {
  const ctx = useContext(ParticipantContext)
  if (!ctx) throw new Error('useParticipant must be used within ParticipantProvider')
  return ctx
}
