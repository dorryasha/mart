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
  <div v-if="product">
    <h1>{{ product.name }}</h1>
    <p>Состав: {{ product.composition }}</p>
    <p>Цена: {{ product.price }} ₽</p>
    <p>Повод: {{ product.occasion }}</p>
    <button class="btn" @click="addItem(product, 'product')">В корзину</button>
    <button @click="toggle(product, 'product')">
      {{ isFavorite(product.id, 'product') ? 'Убрать из избранного' : 'В избранное' }}
    </button>
  </div>
  <div v-else>Товар не найден</div>
</template>