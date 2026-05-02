import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'mart_auth'
const currentUser = ref(null)

// Восстановление сессии
try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) currentUser.value = JSON.parse(saved)
} catch (e) {}

watchEffect(() => {
  if (currentUser.value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser.value))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
})

export function useAuth() {
  function register(login, email, phone, password) {
    const users = JSON.parse(localStorage.getItem('mart_users') || '[]')
    if (users.find(u => u.login === login || u.email === email)) {
      throw new Error('Пользователь с таким логином или email уже существует')
    }
    const newUser = {
      id: Date.now().toString(),
      login,
      email,
      phone,
      password, // в реальном проекте хешировать!
      role: 'user',
      createdAt: new Date().toISOString()
    }
    users.push(newUser)
    localStorage.setItem('mart_users', JSON.stringify(users))
    currentUser.value = { ...newUser }
    delete currentUser.value.password
  }

  function login(loginOrEmail, password) {
    const users = JSON.parse(localStorage.getItem('mart_users') || '[]')
    const user = users.find(u =>
      (u.login === loginOrEmail || u.email === loginOrEmail) && u.password === password
    )
    if (!user) throw new Error('Неверный логин/email или пароль')
    currentUser.value = { ...user }
    delete currentUser.value.password
  }

  function logout() {
    currentUser.value = null
  }

  return { currentUser, register, login, logout }
}