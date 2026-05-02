<script setup>
import { ref, computed } from 'vue'
import { useCart } from '../stores/useCart'
import { useGroupCards } from '../stores/useGroupCards'
import { useOrders } from '../stores/useOrders'
import { useAuth } from '../stores/useAuth'
import { useRouter } from 'vue-router'

const { cart, removeItem, changeQuantity, clearCart } = useCart()
const { createCard } = useGroupCards()
const { createOrder } = useOrders()
const { currentUser } = useAuth()
const router = useRouter()

const showGroupForm = ref(false)
const participantLogin = ref('')
const participants = ref([])

function addParticipant() {
  if (participantLogin.value && !participants.value.includes(participantLogin.value)) {
    participants.value.push(participantLogin.value)
    participantLogin.value = ''
  }
}

function handleCreateGroup() {
  const card = createCard(cart.value, participants.value)
  clearCart()
  router.push('/groupcards/' + card.id)
}

function handleCreateOrder() {
  if (!currentUser.value) {
    router.push('/login')
    return
  }
  const total = cart.value.reduce((s, i) => s + i.price * i.quantity, 0)
  createOrder(currentUser.value.login, cart.value, total)
  clearCart()
  router.push('/profile')
}

const total = computed(() => cart.value.reduce((s, i) => s + i.price * i.quantity, 0))
</script>

<template>
  <h1>Корзина</h1>
  <div v-if="cart.length === 0">Корзина пуста</div>
  <div v-else>
    <div v-for="item in cart" :key="item.id+item.type" class="card" style="margin-bottom:1rem">
      <h3>{{ item.name || item.theme }}</h3>
      <p>{{ item.price }} ₽ x {{ item.quantity }}</p>
      <button @click="changeQuantity(item.id, item.type, -1)">-</button>
      <button @click="changeQuantity(item.id, item.type, 1)">+</button>
      <button @click="removeItem(item.id, item.type)" class="btn-danger">Удалить</button>
    </div>
    <p><strong>Итого: {{ total }} ₽</strong></p>

    <button @click="handleCreateOrder" class="btn" style="margin-right:0.5rem">Оформить заказ</button>

    <button @click="showGroupForm = !showGroupForm" class="btn-warning">
      Создать групповую карточку
    </button>

    <div v-if="showGroupForm" style="margin-top:1rem">
      <h3>Добавьте участников (по логину)</h3>
      <input v-model="participantLogin" placeholder="Логин участника" />
      <button @click="addParticipant" class="btn">Добавить</button>
      <ul>
        <li v-for="p in participants" :key="p">{{ p }}</li>
      </ul>
      <button @click="handleCreateGroup" class="btn">Создать сбор</button>
    </div>
  </div>
</template>