import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'mart_users'
const users = ref([])

try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) users.value = JSON.parse(saved)
} catch (e) {}

// Если нет пользователей, создаём админа
if (users.value.length === 0) {
  users.value.push({
    id: 'admin1',
    login: 'admin',
    email: 'admin@mart.ru',
    phone: '+79990000000',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString()
  })
  users.value.push({
    id: 'florist1',
    login: 'florist',
    email: 'florist@mart.ru',
    phone: '+79991111111',
    password: 'florist123',
    role: 'florist',
    createdAt: new Date().toISOString()
  })
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