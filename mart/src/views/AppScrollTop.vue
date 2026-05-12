<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const show = ref(false)

function onScroll() {
  show.value = window.scrollY > 300
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <button v-if="show" class="scroll-top" @click="scrollTop">⬆</button>
</template>