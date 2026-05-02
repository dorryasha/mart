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
  <div v-if="mc">
    <h1>{{ mc.theme }}</h1>
    <p>{{ mc.description }}</p>
    <p>Дата: {{ mc.date }}</p>
    <p>Цена: {{ mc.price }} ₽</p>
    <p>Осталось мест: {{ mc.places }}</p>
    <button class="btn" @click="addItem(mc, 'masterclass')">Записаться</button>
    <button @click="toggle(mc, 'masterclass')">
      {{ isFavorite(mc.id, 'masterclass') ? 'Убрать из избранного' : 'В избранное' }}
    </button>
  </div>
  <div v-else>Мастер-класс не найден</div>
</template>