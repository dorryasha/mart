import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'mart_orders'
const orders = ref([])

try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) orders.value = JSON.parse(saved)
} catch (e) {}

watchEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders.value))
})

export function useOrders() {
  function createOrder(userLogin, items, total) {
    const order = {
      id: 'ord' + Date.now(),
      userLogin,
      items: items.map(i => ({ ...i })),
      total,
      status: 'Новый', // Новый, Подтверждён, Отменён
      createdAt: new Date().toISOString()
    }
    orders.value.push(order)
    return order
  }

  function updateOrderStatus(orderId, status) {
    const order = orders.value.find(o => o.id === orderId)
    if (order) order.status = status
  }

  function getUserOrders(login) {
    return orders.value.filter(o => o.userLogin === login)
  }

  return { orders, createOrder, updateOrderStatus, getUserOrders }
}