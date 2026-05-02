<script setup>
import { ref, computed } from 'vue'
import { useCatalog } from '../stores/useCatalog'
import { useCart } from '../stores/useCart'
import { useFavorites } from '../stores/useFavorites'
import { useRouter } from 'vue-router'

const { products } = useCatalog()
const { addItem } = useCart()
const { toggle, isFavorite } = useFavorites()
const router = useRouter()

const typeFilter = ref('')
const occasionFilter = ref('')
const sortBy = ref('')
import { useNotifications } from '../stores/useNotifications'

const { show } = useNotifications()

function addToCart(product) {
  addItem(product, 'product')
  show('Добавлено в корзину', 'success')
}
const filteredProducts = computed(() => {
  let list = [...products.value]
  if (typeFilter.value) list = list.filter(p => p.type === typeFilter.value)
  if (occasionFilter.value) list = list.filter(p => p.occasion === occasionFilter.value)
  if (sortBy.value === 'price_asc') list.sort((a,b) => a.price - b.price)
  else if (sortBy.value === 'price_desc') list.sort((a,b) => b.price - a.price)
  else if (sortBy.value === 'name') list.sort((a,b) => a.name.localeCompare(b.name))
  return list
})
</script>

<template>
  <h1>Каталог цветов и букетов</h1>
  <div class="filters" style="margin-bottom:1rem; display:flex; gap:1rem; flex-wrap:wrap;">
    <select v-model="typeFilter">
      <option value="">Все типы</option>
      <option value="букет">Букет</option>
      <option value="цветок">Цветок</option>
      <option value="композиция">Композиция</option>
    </select>
    <select v-model="occasionFilter">
      <option value="">Все поводы</option>
      <option value="день рождения">День рождения</option>
      <option value="свадьба">Свадьба</option>
      <option value="благодарность">Благодарность</option>
      <option value="любой">Любой</option>
    </select>
    <select v-model="sortBy">
      <option value="">Без сортировки</option>
      <option value="price_asc">Цена по возрастанию</option>
      <option value="price_desc">Цена по убыванию</option>
      <option value="name">По названию</option>
    </select>
  </div>

  <div class="catalog-grid">
    <div v-for="product in filteredProducts" :key="product.id" class="card">
  <img
    :src="product.image"
    :alt="product.name"
    class="card-img"
    @error="e => e.target.src = '/images/placeholder.jpg'"
  />
  <h3>{{ product.name }}</h3>
  <p>{{ product.composition }}</p>
  <p><strong>{{ product.price }} ₽</strong></p>
  <div class="card-actions">
    <button class="btn" @click="addItem(product, 'product')">В корзину</button>
    <button @click="toggle(product, 'product')" class="btn-fav">
      {{ isFavorite(product.id, 'product') ? '💖' : '🤍' }}
    </button>
    <button class="btn" @click="router.push('/catalog/'+product.id)">Детали</button>
  </div>
</div>
  </div>
</template>