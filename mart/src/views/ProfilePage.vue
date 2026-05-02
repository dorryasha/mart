<script setup>
import { useAuth } from '../stores/useAuth'
import { useOrders } from '../stores/useOrders'
import { computed } from 'vue'

const { currentUser } = useAuth()
const { getUserOrders } = useOrders()

const orders = computed(() => {
  if (!currentUser.value) return []
  return getUserOrders(currentUser.value.login)
})
</script>

<template>
  <div v-if="currentUser">
    <h1>Личный кабинет</h1>
    <div class="card" style="margin-bottom:2rem">
      <p><strong>Логин:</strong> {{ currentUser.login }}</p>
      <p><strong>Email:</strong> {{ currentUser.email }}</p>
      <p><strong>Телефон:</strong> {{ currentUser.phone }}</p>
      <p><strong>Роль:</strong> {{ currentUser.role === 'admin' ? 'Администратор' : currentUser.role === 'florist' ? 'Флорист' : 'Пользователь' }}</p>
    </div>

    <h2>Мои заказы</h2>
    <div v-if="orders.length === 0">У вас пока нет заказов</div>
    <div v-for="order in orders" :key="order.id" class="card" style="margin-bottom:1rem">
      <p>Заказ #{{ order.id }} от {{ new Date(order.createdAt).toLocaleDateString() }}</p>
      <p>Сумма: {{ order.total }} ₽</p>
      <p>Статус: {{ order.status }}</p>
      <ul>
        <li v-for="item in order.items" :key="item.id">
          {{ item.name || item.theme }} ({{ item.price }} ₽) x{{ item.quantity }}
        </li>
      </ul>
    </div>
  </div>
  <div v-else>Пожалуйста, войдите</div>
</template>