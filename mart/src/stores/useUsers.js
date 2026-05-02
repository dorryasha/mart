import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'mart_users'

const defaultUsers = [
  {
    id: 'admin1',
    login: 'admin',
    email: 'admin@mart.ru',
    phone: '+79990000000',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'florist1',
    login: 'florist',
    email: 'florist@mart.ru',
    phone: '+79991111111',
    password: 'florist123',
    role: 'florist',
    createdAt: new Date().toISOString()
  }
]

const users = ref([])

function initUsers() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
    users.value = defaultUsers
  } else {
    try {
      users.value = JSON.parse(saved)
    } catch (e) {
      users.value = defaultUsers
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
    }
  }
}
initUsers()

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