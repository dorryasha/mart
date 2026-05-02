<script setup>
import { useModal } from '../stores/useModal'

const { isOpen, title, message, confirm, cancel } = useModal()
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="cancel">
    <div class="modal-card">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="modal-actions">
        <button class="btn" @click="confirm">Да</button>
        <button class="btn btn-warning" @click="cancel">Нет</button>
      </div>
    </div>
  </div>
</template>