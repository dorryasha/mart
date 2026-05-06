<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './stores/useAuth'
import AppNotification from './views/AppNotification.vue'
import AppModal from './views/AppModal.vue'
import AppScrollTop from './views/AppScrollTop.vue'

const { currentUser, logout } = useAuth()
const router = useRouter()

const isLoggedIn = computed(() => currentUser.value !== null)
const isAdmin = computed(() => currentUser.value?.role === 'admin')
const isFlorist = computed(() => currentUser.value?.role === 'florist' || isAdmin.value)

function handleLogout() {
  logout()
  router.push('/')
}
</script>

<template>
  <header class="header">
    <div class="container nav-bar">
      <router-link to="/" class="logo">🌸 Mart</router-link>
      <nav>
        <router-link to="/catalog">Каталог</router-link>
        <router-link to="/masterclasses">Мастер-классы</router-link>
        <router-link to="/cart">Корзина</router-link>
        <router-link to="/favorites">Избранное</router-link>
        <template v-if="isLoggedIn">
          <router-link to="/profile">Личный кабинет</router-link>
          <router-link to="/groupcards">Групповые сборы</router-link>
          <span v-if="isFlorist">
            <router-link to="/admin">Управление</router-link>
          </span>
          <a href="#" @click.prevent="handleLogout">Выйти</a>
        </template>
        <template v-else>
          <router-link to="/login">Войти</router-link>
          <router-link to="/register">Регистрация</router-link>
        </template>
      </nav>
    </div>
  </header>

  <main class="container content">
    <router-view v-slot="{ Component }">
  <transition name="fade" mode="out-in">
    <component :is="Component" />
  </transition>
</router-view>
  </main>
<AppNotification />
<AppModal />
  <footer class="footer">
    <div class="container">
      <router-link to="/about">О магазине</router-link>
      <router-link to="/contacts">Контакты</router-link>
      <router-link to="/howtogroup">Как заказать групповой сбор</router-link>
      <router-link to="/policy">Политика конфиденциальности</router-link>
    </div>
  </footer>
</template>