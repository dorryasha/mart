<script setup>
import { ref } from 'vue'
import { useAuth } from '../stores/useAuth'
import { useRouter } from 'vue-router'

const login = ref('')
const password = ref('')
const error = ref('')
const { login: doLogin } = useAuth()
const router = useRouter()

async function handleSubmit() {
  try {
    await doLogin(login.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <h1>Вход</h1>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label>Логин или email</label>
      <input v-model="login" required />
    </div>
    <div class="form-group">
      <label>Пароль</label>
      <input type="password" v-model="password" required />
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <button type="submit" class="btn">Войти</button>
  </form>
</template>