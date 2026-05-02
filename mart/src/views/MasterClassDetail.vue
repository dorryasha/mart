<script setup>
import { useRoute } from 'vue-router'
import { useCatalog } from '../stores/useCatalog'
import { useCart } from '../stores/useCart'
import { useFavorites } from '../stores/useFavorites'
import { computed } from 'vue'

const route = useRoute()
const { masterClasses } = useCatalog()
const { addItem } = useCart()
const { toggle, isFavorite } = useFavorites()

const mc = computed(() => masterClasses.value.find(m => m.id === route.params.id))
</script>

<template>
  <div v-if="mc" class="detail-card">
    <img
      :src="mc.image"
      :alt="mc.theme"
      class="detail-img"
      @error="e => e.target.src = '/images/placeholder.jpg'"
    />
    <h1>{{ mc.theme }}</h1>
    <p>{{ mc.description }}</p>
    <p><strong>Дата:</strong> {{ mc.date }}</p>
    <p><strong>Цена:</strong> {{ mc.price }} ₽</p>
    <p><strong>Осталось мест:</strong> {{ mc.places }}</p>
    <div class="card-actions">
      <button class="btn" @click="addItem(mc, 'masterclass')">Записаться</button>
      <button @click="toggle(mc, 'masterclass')" class="btn-fav">
        {{ isFavorite(mc.id, 'masterclass') ? '💖 Убрать из избранного' : '🤍 В избранное' }}
      </button>
    </div>
  </div>
  <div v-else class="empty">Мастер-класс не найден</div>
</template>