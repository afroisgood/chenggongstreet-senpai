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

  const setNickname = useCallback((name) => {
    localStorage.setItem('nickname', name)
    setNicknameState(name)
  }, [])

  return (
    <ParticipantContext.Provider value={{ nickname, setNickname, participantId }}>
      {children}
    </ParticipantContext.Provider>
  )
}

export function useParticipant() {
  const ctx = useContext(ParticipantContext)
  if (!ctx) throw new Error('useParticipant must be used within ParticipantProvider')
  return ctx
}
