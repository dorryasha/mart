<script setup>
import { useGroupCards } from '../stores/useGroupCards'
import { useAuth } from '../stores/useAuth'
import { computed } from 'vue'

const { currentUser } = useAuth()
const { getUserCards } = useGroupCards()

const myCards = computed(() => getUserCards(currentUser.value.login))
</script>

<template>
  <h1>Мои групповые сборы</h1>
  <div v-if="myCards.length === 0">У вас пока нет групповых карточек</div>
  <div v-for="card in myCards" :key="card.id" class="card" style="margin-bottom:1rem">
    <router-link :to="'/groupcards/' + card.id">
      Карточка #{{ card.id }} от {{ card.createdAt.slice(0,10) }} – сумма {{ card.total }} ₽
    </router-link>
    <p>Участников: {{ card.participants.length }}, доля: {{ card.share.toFixed(2) }} ₽</p>
  </div>
</template>