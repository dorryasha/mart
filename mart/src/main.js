import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles.css'


const USERS_KEY = 'mart_users'
if (!localStorage.getItem(USERS_KEY)) {
  const defaultUsers = [
    {
      id: 'admin1',
      login: 'admin',
      email: 'admin@mart.ru',
      phone: '+79990000000',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: 'florist1',
      login: 'florist',
      email: 'florist@mart.ru',
      phone: '+79991111111',
      password: 'florist123',
      role: 'florist',
      createdAt: new Date().toISOString()
    }
  ]
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers))
}


createApp(App).use(router).mount('#app')