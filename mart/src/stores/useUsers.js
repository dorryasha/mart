import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'mart_users'
const users = ref([])

try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) users.value = JSON.parse(saved)
} catch (e) {
  users.value = []
}

watchEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users.value))
})

export function useUsers() {
  function getAllUsers() {
    return users.value
  }

  function updateUserRole(userId, role) {
    const user = users.value.find(u => u.id === userId)
    if (user) user.role = role
  }

  function deleteUser(userId) {
    users.value = users.value.filter(u => u.id !== userId)
  }

  return { users, getAllUsers, updateUserRole, deleteUser }
}