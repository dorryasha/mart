<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useCatalog } from '../stores/useCatalog'
import { useCart } from '../stores/useCart'
import { useFavorites } from '../stores/useFavorites'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const { products } = useCatalog()
const { addItem } = useCart()
const { toggle, isFavorite } = useFavorites()

const product = computed(() => products.value.find(p => p.id === route.params.id))
</script>

<template>
  <div v-if="product" class="detail-card">
    <img
      :src="product.image"
      :alt="product.name"
      class="detail-img"
      @error="e => e.target.src = '/mart/images/placeholder.jpg'"
    />
    <h1>{{ product.name }}</h1>
    <p><strong>Состав:</strong> {{ product.composition }}</p>
    <p><strong>Цена:</strong> {{ product.price }} ₽</p>
    <p><strong>Повод:</strong> {{ product.occasion }}</p>
    <div class="card-actions">
      <button class="btn" @click="addItem(product, 'product')">В корзину</button>
      <button @click="toggle(product, 'product')" class="btn-fav">
        {{ isFavorite(product.id, 'product') ? '💖 Убрать из избранного' : '🤍 В избранное' }}
      </button>
    </div>
  </div>
  <div v-else class="empty">Товар не найден</div>
</template>