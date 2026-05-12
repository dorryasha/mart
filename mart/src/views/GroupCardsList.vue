<script setup>
import { useGroupCards } from '../stores/useGroupCards'
import { useAuth } from '../stores/useAuth'
import { computed } from 'vue'

const { currentUser } = useAuth()
const { getUserCards } = useGroupCards()

const myCards = computed(() => getUserCards(currentUser.value.login))
</script>

<template>
  <div class="group-list-page">
    <div class="group-list-header">
      <h1>Мои групповые сборы</h1>
    </div>

    <div v-if="myCards.length === 0">
      У вас пока нет групповых карточек
    </div>

    <div
      v-for="card in myCards"
      :key="card.id"
      class="group-list-card"
    >
      <router-link
        :to="'/groupcards/' + card.id"
        class="group-list-link"
      >
        <div class="group-list-top">
          <div>
            <h2 class="group-list-title">
              Карточка #{{ card.id.slice(0, 8) }}
            </h2>

            <p class="group-list-date">
              {{ card.createdAt.slice(0, 10) }}
            </p>
          </div>

          
        </div>

        <div class="group-list-info">
          <div class="group-list-info-block">
            <span class="group-info-label">
              Участников
            </span>

            <span class="group-info-value">
              {{ card.participants.length }}
            </span>
          </div>

          <div class="group-list-info-block">
            <span class="group-info-label">
              Доля
            </span>

            <span class="group-info-value">
              {{ card.share.toFixed(2) }} ₽
            </span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>