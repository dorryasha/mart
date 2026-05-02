<script setup>
import { useNotifications } from '../stores/useNotifications'

const { notifications, remove } = useNotifications()
</script>

<template>
  <div class="notifications-container">
    <transition-group name="notif">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        :class="['notification', `notif-${notif.type}`]"
        @click="remove(notif.id)"
      >
        {{ notif.message }}
      </div>
    </transition-group>
  </div>
</template>