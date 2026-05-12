<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useGroupCards } from '../stores/useGroupCards'
import { useAuth } from '../stores/useAuth'
import { useNotifications } from '../stores/useNotifications'
import { useModal } from '../stores/useModal'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const { currentUser } = useAuth()
const { groupCards, markAsPaid, confirmPayment, rejectPayment, deleteCard } = useGroupCards()
const { show } = useNotifications()
const { open } = useModal()

const card = computed(() => groupCards.value.find(c => c.id === route.params.id))

async function handlePay() {
  markAsPaid(card.value.id)
  show('Оплата отправлена на подтверждение', 'success')
}

async function confirm(login) {
  confirmPayment(card.value.id, login)
  show(`Оплата от ${login} подтверждена`, 'success')
}

async function reject(login) {
  rejectPayment(card.value.id, login)
  show(`Оплата от ${login} отклонена`, 'error')
}

async function removeCard() {
  const ok = await open('Удаление карточки', 'Удалить эту групповую карточку?')
  if (ok) {
    deleteCard(card.value.id)
    router.push('/groupcards')
    show('Групповая карточка удалена', 'error')
  }
}

const isAdminOrFlorist = computed(() => ['admin', 'florist'].includes(currentUser.value?.role))
</script>

<template>
  <div
    v-if="card"
    class="group-detail-page"
  >
    <div class="group-detail-card">
      <div class="group-detail-header">
        <div>
          <h1>Групповая карточка</h1>

          <p class="group-creator">
            Инициатор: {{ card.initiator }}
          </p>

          <p class="group-date">
            Создана:
            {{ new Date(card.createdAt).toLocaleDateString() }}
          </p>
        </div>
      </div>

      <div class="group-info">
        <div class="info-block">
          <span class="info-label">
            Общая сумма
          </span>

          <span class="info-value">
            {{ card.total }} ₽
          </span>
        </div>

        <div class="info-block">
          <span class="info-label">
            Доля каждого
          </span>

          <span class="info-value">
            {{ card.share.toFixed(2) }} ₽
          </span>
        </div>
      </div>

      <div class="group-products">
        <h2>Товары / Мастер-классы</h2>

        <div
          v-for="item in card.items"
          :key="item.id"
          class="product-item"
        >
          <span>
            {{ item.name || item.theme }}
          </span>

          <span>
            {{ item.price }} ₽ × {{ item.quantity }}
          </span>
        </div>
      </div>

      <div class="participants-section">
        <h2>Участники</h2>

        <div
          v-for="p in card.participants"
          :key="p.login"
          class="participant-card"
        >
          <div class="participant-left">
            <span>
              {{ p.login }}
            </span>
          </div>

          <div class="participant-right">
            <span
              :class="[
                'payment-status',
                p.status
              ]"
            >
              {{
                p.status === 'not_paid'
                  ? 'Не оплачено'
                  : p.status === 'pending'
                  ? 'Ожидает подтверждения'
                  : 'Оплачено'
              }}
            </span>

            <template
              v-if="
                p.login === currentUser?.login &&
                p.status === 'not_paid'
              "
            >
              <button
                @click="handlePay"
                class="pay-btn"
              >
                Я оплатил
              </button>
            </template>

            <template
              v-if="
                isAdminOrFlorist &&
                p.status === 'pending'
              "
            >
              <button
                @click="confirm(p.login)"
                class="confirm-btn"
              >
                Подтвердить
              </button>

              <button
                @click="reject(p.login)"
                class="reject-btn"
              >
                Отклонить
              </button>
            </template>
          </div>
        </div>
      </div>

      <button
        @click="removeCard"
        class="delete-card-btn"
      >
        Удалить карточку
      </button>
    </div>
  </div>

  <div v-else>
    Карточка не найдена
  </div>
</template>