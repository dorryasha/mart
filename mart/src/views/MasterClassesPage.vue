<script setup>
import { ref, computed } from 'vue'
import { useCatalog } from '../stores/useCatalog'
import { useCart } from '../stores/useCart'
import { useFavorites } from '../stores/useFavorites'
import { useRouter } from 'vue-router'

const { masterClasses } = useCatalog()
const { addItem } = useCart()
const { toggle, isFavorite } = useFavorites()
const router = useRouter()

const dateFrom = ref('')
const dateTo = ref('')
const themeFilter = ref('')
const sortBy = ref('')

const filteredMC = computed(() => {
  let list = [...masterClasses.value]
  if (dateFrom.value) list = list.filter(m => m.date >= dateFrom.value)
  if (dateTo.value) list = list.filter(m => m.date <= dateTo.value)
  if (themeFilter.value) list = list.filter(m => m.theme.toLowerCase().includes(themeFilter.value.toLowerCase()))
  if (sortBy.value === 'date_asc') list.sort((a,b) => a.date.localeCompare(b.date))
  else if (sortBy.value === 'date_desc') list.sort((a,b) => b.date.localeCompare(a.date))
  else if (sortBy.value === 'price_asc') list.sort((a,b) => a.price - b.price)
  else if (sortBy.value === 'price_desc') list.sort((a,b) => b.price - a.price)
  return list
})
</script>

<template>
  <h1>Мастер-классы</h1>
  <div class="filters" style="margin-bottom:1rem; display:flex; gap:1rem; flex-wrap:wrap;">
    <input type="date" v-model="dateFrom" placeholder="С даты" />
    <input type="date" v-model="dateTo" placeholder="По дату" />
    <input v-model="themeFilter" placeholder="Название темы" />
    <select v-model="sortBy">
      <option value="">Без сортировки</option>
      <option value="date_asc">Дата (раньше)</option>
      <option value="date_desc">Дата (позже)</option>
      <option value="price_asc">Цена по возрастанию</option>
      <option value="price_desc">Цена по убыванию</option>
    </select>
  </div>

  <div class="catalog-grid">
    <div v-for="mc in filteredMC" :key="mc.id" class="card">
      <h3>{{ mc.theme }}</h3>
      <p>{{ mc.description }}</p>
      <p><strong>{{ mc.date }}</strong></p>
      <p>Цена: {{ mc.price }} ₽ | Мест: {{ mc.places }}</p>
      <div style="display:flex; gap:0.5rem; margin-top:0.5rem;">
        <button class="btn" @click="addItem(mc, 'masterclass')">Записаться</button>
        <button @click="toggle(mc, 'masterclass')">
          {{ isFavorite(mc.id, 'masterclass') ? '💖' : '🤍' }}
        </button>
        <button class="btn" @click="router.push('/masterclasses/'+mc.id)">Детали</button>
      </div>
    </div>
  </div>
</template>