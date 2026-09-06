import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  setDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

// 依 createdAt 由新到舊排序（serverTimestamp 剛送出時本地端可能還是 null，排最前面）
function sortByCreatedAtDesc(docs) {
  return [...docs].sort((a, b) => (b.createdAt?.toMillis?.() ?? Infinity) - (a.createdAt?.toMillis?.() ?? Infinity))
}

// ---- config（目前階段 / 提問靈感菜單題目）----
const configRef = doc(db, 'config', 'main')

export function subscribeConfig(callback) {
  return onSnapshot(configRef, (snap) => {
    callback(snap.exists() ? snap.data() : { currentStageId: 'icebreak', menuQuestionText: '' })
  })
}

export function setCurrentStage(stageId) {
  return setDoc(configRef, { currentStageId: stageId }, { merge: true })
}

export function setMenuQuestionText(text) {
  return setDoc(configRef, { menuQuestionText: text }, { merge: true })
}

// ---- 留言 ----
export function subscribeComments(stageId, callback) {
  const q = query(collection(db, 'comments'), where('stageId', '==', stageId))
  return onSnapshot(q, (snap) => {
    callback(sortByCreatedAtDesc(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
  })
}

export function subscribeAllComments(callback) {
  const q = query(collection(db, 'comments'))
  return onSnapshot(q, (snap) => {
    callback(sortByCreatedAtDesc(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
  })
}

const MAX_COMMENT_LENGTH = 100

export function postComment({ stageId, nickname, text }) {
  const trimmed = text.trim().slice(0, MAX_COMMENT_LENGTH)
  if (!trimmed) return Promise.resolve()
  return addDoc(collection(db, 'comments'), {
    stageId,
    nickname,
    text: trimmed,
    createdAt: serverTimestamp(),
  })
}

export function deleteComment(commentId) {
  return deleteDoc(doc(db, 'comments', commentId))
}

// ---- 投票 ----
export function subscribeVotes(stageId, callback) {
  const q = query(collection(db, 'votes'), where('stageId', '==', stageId))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export function submitVote({ stageId, participantId, nickname, options }) {
  const voteId = `${stageId}__${participantId}`
  return setDoc(doc(db, 'votes', voteId), {
    stageId,
    participantId,
    nickname,
    options,
    createdAt: serverTimestamp(),
  })
}
