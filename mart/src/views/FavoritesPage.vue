<script setup>
import { useFavorites } from '../stores/useFavorites'
import { useCart } from '../stores/useCart'

const { favorites, toggle } = useFavorites()
const { addItem } = useCart()
</script>

<template>
  <h1>Избранное</h1>
  <div v-if="favorites.length === 0">Нет избранных позиций</div>
  <div class="catalog-grid">
    <div v-for="fav in favorites" :key="fav.id+fav.type" class="card">
      <h3>{{ fav.name || fav.theme }}</h3>
      <p v-if="fav.price">Цена: {{ fav.price }} ₽</p>
      <div style="display:flex; gap:0.5rem; margin-top:0.5rem;">
        <button class="btn" @click="addItem(fav, fav.type)">В корзину</button>
        <button @click="toggle(fav, fav.type)">Удалить из избранного</button>
      </div>
    </div>
  </div>
</template>