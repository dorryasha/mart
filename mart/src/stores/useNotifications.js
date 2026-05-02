import { ref } from 'vue'

const notifications = ref([])
let idCounter = 0

export function useNotifications() {
  function show(message, type = 'success', duration = 3000) {
    const id = ++idCounter
    notifications.value.push({ id, message, type })
    if (duration > 0) {
      setTimeout(() => {
        notifications.value = notifications.value.filter(n => n.id !== id)
      }, duration)
    }
    return id
  }

  function remove(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  return { notifications, show, remove }
}