import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../stores/useAuth'

const routes = [
  { path: '/', component: () => import('../views/HomePage.vue') },
  { path: '/catalog', component: () => import('../views/CatalogPage.vue') },
  { path: '/catalog/:id', component: () => import('../views/ProductDetail.vue') },
  { path: '/masterclasses', component: () => import('../views/MasterClassesPage.vue') },
  { path: '/masterclasses/:id', component: () => import('../views/MasterClassDetail.vue') },
  { path: '/cart', component: () => import('../views/CartPage.vue') },
  { path: '/favorites', component: () => import('../views/FavoritesPage.vue') },
  { path: '/login', component: () => import('../views/LoginPage.vue') },
  { path: '/register', component: () => import('../views/RegisterPage.vue') },
  {
    path: '/profile',
    component: () => import('../views/ProfilePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: () => import('../views/AdminPanel.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'florist'] }
  },
  {
    path: '/groupcards',
    component: () => import('../views/GroupCardsList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/groupcards/:id',
    component: () => import('../views/GroupCardDetail.vue'),
    meta: { requiresAuth: true }
  },
  { path: '/about', component: () => import('../views/AboutPage.vue') },
  { path: '/contacts', component: () => import('../views/ContactsPage.vue') },
  { path: '/howtogroup', component: () => import('../views/HowToGroupPage.vue') },
  { path: '/policy', component: () => import('../views/PolicyPage.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const { currentUser } = useAuth()
  if (to.meta.requiresAuth && !currentUser.value) {
    next('/login')
  } else if (to.meta.roles && currentUser.value) {
    if (!to.meta.roles.includes(currentUser.value.role)) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router