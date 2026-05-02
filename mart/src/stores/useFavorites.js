import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'mart_favorites'
const favorites = ref([])

try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) favorites.value = JSON.parse(saved)
} catch (e) {}

watchEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
})

export function useFavorites() {
  function toggle(item, type = 'product') {
    const exists = favorites.value.find(f => f.id === item.id && f.type === type)
    if (exists) {
      favorites.value = favorites.value.filter(f => !(f.id === item.id && f.type === type))
    } else {
      favorites.value.push({ ...item, type })
    }
  }

  function isFavorite(id, type = 'product') {
    return favorites.value.some(f => f.id === id && f.type === type)
  }

  return { favorites, toggle, isFavorite }
}