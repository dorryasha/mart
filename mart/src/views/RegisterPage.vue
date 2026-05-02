<script setup>
import { ref } from 'vue'
import { useAuth } from '../stores/useAuth'
import { useRouter } from 'vue-router'

const login = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const error = ref('')
const { register } = useAuth()
const router = useRouter()

async function handleSubmit() {
  try {
    await register(login.value, email.value, phone.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <h1>Регистрация</h1>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label>Логин</label>
      <input v-model="login" required />
    </div>
    <div class="form-group">
      <label>Email</label>
      <input type="email" v-model="email" required />
    </div>
    <div class="form-group">
      <label>Телефон</label>
      <input v-model="phone" placeholder="+7 (___) ___-__-__" />
    </div>
    <div class="form-group">
      <label>Пароль</label>
      <input type="password" v-model="password" required minlength="4" />
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <button type="submit" class="btn">Зарегистрироваться</button>
  </form>
</template>