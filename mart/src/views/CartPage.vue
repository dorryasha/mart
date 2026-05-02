<script setup>
import { ref, computed } from 'vue'
import { useCart } from '../stores/useCart'
import { useGroupCards } from '../stores/useGroupCards'
import { useOrders } from '../stores/useOrders'
import { useAuth } from '../stores/useAuth'
import { useRouter } from 'vue-router'
import { useNotifications } from '../stores/useNotifications'
import { useModal } from '../stores/useModal'

const { cart, removeItem, changeQuantity, clearCart } = useCart()
const { createCard } = useGroupCards()
const { createOrder } = useOrders()
const { currentUser } = useAuth()
const router = useRouter()
const { show } = useNotifications()
const { open } = useModal()

const showGroupForm = ref(false)
const participantLogin = ref('')
const participants = ref([])

function addParticipant() {
  if (participantLogin.value && !participants.value.includes(participantLogin.value)) {
    participants.value.push(participantLogin.value)
    participantLogin.value = ''
  }
}

function removeParticipant(login) {
  participants.value = participants.value.filter(p => p !== login)
}

async function handleRemoveItem(itemId, type) {
  const ok = await open('Удаление', 'Удалить этот товар из корзины?')
  if (ok) {
    removeItem(itemId, type)
    show('Товар удалён', 'error')
  }
}

async function handleCreateGroup() {
  const ok = await open('Групповой сбор', 'Создать групповую карточку на основе корзины?')
  if (!ok) return
  const card = createCard(cart.value, participants.value)
  clearCart()
  router.push('/groupcards/' + card.id)
  show('Групповая карточка создана', 'success')
}

async function handleCreateOrder() {
  if (!currentUser.value) {
    router.push('/login')
    return
  }
  const ok = await open('Оформление заказа', 'Подтвердить заказ?')
  if (!ok) return
  const total = cart.value.reduce((s, i) => s + i.price * i.quantity, 0)
  createOrder(currentUser.value.login, cart.value, total)
  clearCart()
  router.push('/profile')
  show('Заказ оформлен', 'success')
}

const total = computed(() => cart.value.reduce((s, i) => s + i.price * i.quantity, 0))
</script>

<template>
  <h1>Корзина</h1>

  <div v-if="cart.length === 0" class="empty">Корзина пуста</div>

  <div v-else>
    <div v-for="item in cart" :key="item.id + item.type" class="cart-card">
      <img
        :src="item.image || '/mart/images/placeholder.jpg'"
        :alt="item.name || item.theme"
        class="cart-card-img"
      />
      <div class="cart-card-info">
        <h3>{{ item.name || item.theme }}</h3>
        <p class="cart-card-price">{{ item.price }} ₽</p>
      </div>
      <div class="cart-card-qty">
        <button @click="changeQuantity(item.id, item.type, -1)" class="qty-btn">−</button>
        <span class="qty-value">{{ item.quantity }}</span>
        <button @click="changeQuantity(item.id, item.type, 1)" class="qty-btn">+</button>
      </div>
      <button @click="handleRemoveItem(item.id, item.type)" class="cart-card-remove" title="Удалить">
        ✕
      </button>
    </div>

    <div class="cart-footer">
      <p class="cart-total">Итого: <strong>{{ total }} ₽</strong></p>

      <div class="cart-actions">
        <button class="btn" @click="handleCreateOrder">Оформить заказ</button>
        <button class="btn btn-warning" @click="showGroupForm = !showGroupForm">
          {{ showGroupForm ? 'Скрыть' : 'Создать групповую карточку' }}
        </button>
      </div>

      <div v-if="showGroupForm" class="group-form">
        <h3>Добавьте участников (по логину)</h3>
        <div class="group-form-row">
          <input v-model="participantLogin" placeholder="Логин участника" />
          <button class="btn" @click="addParticipant">Добавить</button>
        </div>
        <ul v-if="participants.length" class="participant-list">
          <li v-for="p in participants" :key="p">
            {{ p }}
            <button @click="removeParticipant(p)" class="btn-sm">✕</button>
          </li>
        </ul>
        <button v-if="participants.length" class="btn" @click="handleCreateGroup">
          Создать сбор
        </button>
      </div>
    </div>
  </div>
</template>