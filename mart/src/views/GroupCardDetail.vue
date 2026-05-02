<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useGroupCards } from '../stores/useGroupCards'
import { useAuth } from '../stores/useAuth'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const { currentUser } = useAuth()
const { groupCards, markAsPaid, confirmPayment, rejectPayment, deleteCard } = useGroupCards()

const card = computed(() => groupCards.value.find(c => c.id === route.params.id))

function handlePay() {
  markAsPaid(card.value.id)
}

function confirm(login) {
  confirmPayment(card.value.id, login)
}

function reject(login) {
  rejectPayment(card.value.id, login)
}

function removeCard() {
  if (confirm('Удалить карточку?')) {
    deleteCard(card.value.id)
    router.push('/groupcards')
  }
}

const isAdminOrFlorist = computed(() => ['admin','florist'].includes(currentUser.value?.role))
</script>

<template>
  <div v-if="card">
    <h1>Групповая карточка</h1>
    <p>Инициатор: {{ card.initiator }}</p>
    <p>Создана: {{ new Date(card.createdAt).toLocaleDateString() }}</p>
    <p>Общая сумма: {{ card.total }} ₽</p>
    <p>Доля каждого: {{ card.share.toFixed(2) }} ₽</p>

    <h3>Товары/Мастер-классы:</h3>
    <ul>
      <li v-for="item in card.items" :key="item.id">
        {{ item.name || item.theme }} ({{ item.price }} ₽) x{{ item.quantity }}
      </li>
    </ul>

    <h3>Участники:</h3>
    <ul>
      <li v-for="p in card.participants" :key="p.login">
        {{ p.login }} –
        <span :class="{
          'status-red': p.status === 'not_paid',
          'status-yellow': p.status === 'pending',
          'status-green': p.status === 'paid'
        }">
          {{ p.status === 'not_paid' ? 'Не оплачено' : p.status === 'pending' ? 'Ожидает подтверждения' : 'Оплачено' }}
        </span>
        <template v-if="p.login === currentUser?.login && p.status === 'not_paid'">
          <button @click="handlePay" class="btn">Я оплатил</button>
        </template>
        <template v-if="isAdminOrFlorist && p.status === 'pending'">
          <button @click="confirm(p.login)" class="btn" style="background:var(--success)">Подтвердить</button>
          <button @click="reject(p.login)" class="btn-danger">Отклонить</button>
        </template>
      </li>
    </ul>

    <button @click="removeCard" class="btn-danger" style="margin-top:1rem">Удалить карточку</button>
  </div>
  <div v-else>Карточка не найдена</div>
</template>