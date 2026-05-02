import { ref, watchEffect } from 'vue'
import { useAuth } from './useAuth'

const STORAGE_KEY = 'mart_groupcards'
const groupCards = ref([])

try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) groupCards.value = JSON.parse(saved)
} catch (e) {}

watchEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groupCards.value))
})

export function useGroupCards() {
  const { currentUser } = useAuth()

  function createCard(cartItems, participantsLogins = []) {
    const initiator = currentUser.value.login
    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const allParticipants = [initiator, ...participantsLogins]
    const share = total / allParticipants.length

    const card = {
      id: 'gc' + Date.now(),
      initiator,
      items: cartItems.map(i => ({ ...i })),
      total,
      participants: allParticipants.map(login => ({
        login,
        status: 'not_paid' // not_paid, pending, paid
      })),
      share,
      createdAt: new Date().toISOString(),
      active: true
    }
    groupCards.value.push(card)
    return card
  }

  function markAsPaid(cardId) {
    const card = groupCards.value.find(c => c.id === cardId)
    if (!card) return
    const participant = card.participants.find(p => p.login === currentUser.value.login)
    if (participant && participant.status === 'not_paid') {
      participant.status = 'pending'
    }
  }

  function confirmPayment(cardId, login) {
    const card = groupCards.value.find(c => c.id === cardId)
    if (!card) return
    const participant = card.participants.find(p => p.login === login)
    if (participant && participant.status === 'pending') {
      participant.status = 'paid'
    }
  }

  function rejectPayment(cardId, login) {
    const card = groupCards.value.find(c => c.id === cardId)
    if (!card) return
    const participant = card.participants.find(p => p.login === login)
    if (participant && participant.status === 'pending') {
      participant.status = 'not_paid'
    }
  }

  function deleteCard(cardId) {
    groupCards.value = groupCards.value.filter(c => c.id !== cardId)
  }

  function getUserCards(login) {
    return groupCards.value.filter(c => c.participants.some(p => p.login === login))
  }

  return { groupCards, createCard, markAsPaid, confirmPayment, rejectPayment, deleteCard, getUserCards }
}