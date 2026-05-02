import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'mart_cart'
const cart = ref([])

try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) cart.value = JSON.parse(saved)
} catch (e) {}

watchEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.value))
})

export function useCart() {
  function addItem(item, type = 'product') {
    const existing = cart.value.find(i => i.id === item.id && i.type === type)
    if (existing) {
      existing.quantity++
    } else {
      cart.value.push({ ...item, type, quantity: 1 })
    }
  }

  function removeItem(id, type) {
    cart.value = cart.value.filter(i => !(i.id === id && i.type === type))
  }

  function changeQuantity(id, type, delta) {
    const item = cart.value.find(i => i.id === id && i.type === type)
    if (item) {
      item.quantity += delta
      if (item.quantity <= 0) removeItem(id, type)
    }
  }

  function clearCart() {
    cart.value = []
  }

  return { cart, addItem, removeItem, changeQuantity, clearCart }
}