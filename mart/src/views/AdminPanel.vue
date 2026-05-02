<script setup>
import { ref } from 'vue'
import { useCatalog } from '../stores/useCatalog'
import { useUsers } from '../stores/useUsers'
import { useOrders } from '../stores/useOrders'
import { useGroupCards } from '../stores/useGroupCards'
import { useNotifications } from '../stores/useNotifications'
import { useModal } from '../stores/useModal'

const { products, masterClasses, addProduct, updateProduct, removeProduct, addMasterClass, updateMasterClass, removeMasterClass } = useCatalog()
const { users, updateUserRole, deleteUser } = useUsers()
const { orders, updateOrderStatus } = useOrders()
const { groupCards } = useGroupCards()
const { show } = useNotifications()
const { open } = useModal()

const tab = ref('products')

const productForm = ref({ name: '', composition: '', price: 0, type: 'букет', occasion: 'любой', image: '' })
const editingProductId = ref(null)

function saveProduct() {
  if (editingProductId.value) {
    updateProduct(editingProductId.value, productForm.value)
    editingProductId.value = null
    show('Товар обновлён', 'success')
  } else {
    addProduct({ ...productForm.value, price: Number(productForm.value.price) })
    show('Товар добавлен', 'success')
  }
  productForm.value = { name: '', composition: '', price: 0, type: 'букет', occasion: 'любой', image: '' }
}

function editProduct(product) {
  editingProductId.value = product.id
  productForm.value = { ...product }
}

async function removeProductWithConfirm(productId) {
  const ok = await open('Удаление товара', 'Вы уверены, что хотите удалить этот товар?')
  if (ok) {
    removeProduct(productId)
    show('Товар удалён', 'error')
  }
}

const mcForm = ref({ theme: '', description: '', date: '', price: 0, places: 10, image: '' })
const editingMCId = ref(null)

function saveMC() {
  if (editingMCId.value) {
    updateMasterClass(editingMCId.value, mcForm.value)
    editingMCId.value = null
    show('Мастер-класс обновлён', 'success')
  } else {
    addMasterClass({ ...mcForm.value, price: Number(mcForm.value.price), places: Number(mcForm.value.places) })
    show('Мастер-класс добавлен', 'success')
  }
  mcForm.value = { theme: '', description: '', date: '', price: 0, places: 10, image: '' }
}

function editMC(mc) {
  editingMCId.value = mc.id
  mcForm.value = { ...mc }
}

async function removeMCWithConfirm(mcId) {
  const ok = await open('Удаление мастер-класса', 'Вы уверены, что хотите удалить этот мастер-класс?')
  if (ok) {
    removeMasterClass(mcId)
    show('Мастер-класс удалён', 'error')
  }
}

async function deleteUserWithConfirm(userId) {
  const ok = await open('Удаление пользователя', 'Вы уверены, что хотите удалить этого пользователя?')
  if (ok) {
    deleteUser(userId)
    show('Пользователь удалён', 'error')
  }
}
</script>

<template>
  <h1>Административная панель</h1>

  <div class="tabs">
    <button :class="{ active: tab === 'products' }" @click="tab = 'products'">Товары</button>
    <button :class="{ active: tab === 'masterclasses' }" @click="tab = 'masterclasses'">Мастер-классы</button>
    <button :class="{ active: tab === 'users' }" @click="tab = 'users'">Пользователи</button>
    <button :class="{ active: tab === 'orders' }" @click="tab = 'orders'">Заказы</button>
    <button :class="{ active: tab === 'groupcards' }" @click="tab = 'groupcards'">Групповые карточки</button>
  </div>

  <div v-if="tab === 'products'">
    <div class="card admin-form">
      <h2>{{ editingProductId ? 'Редактировать товар' : 'Добавить товар' }}</h2>
      <div class="form-group">
        <input v-model="productForm.name" placeholder="Название" />
      </div>
      <div class="form-group">
        <input v-model="productForm.composition" placeholder="Состав" />
      </div>
      <div class="form-group">
        <input v-model.number="productForm.price" type="number" placeholder="Цена" />
      </div>
      <div class="form-group">
        <select v-model="productForm.type">
          <option value="букет">Букет</option>
          <option value="цветок">Цветок</option>
          <option value="композиция">Композиция</option>
        </select>
      </div>
      <div class="form-group">
        <select v-model="productForm.occasion">
          <option value="любой">Любой</option>
          <option value="день рождения">День рождения</option>
          <option value="свадьба">Свадьба</option>
          <option value="благодарность">Благодарность</option>
        </select>
      </div>
      <button class="btn" @click="saveProduct">Сохранить</button>
    </div>

    <div class="catalog-grid">
      <div v-for="product in products" :key="product.id" class="card">
        <img
          :src="product.image || '/images/placeholder.jpg'"
          :alt="product.name"
          class="card-img"
        />
        <h3>{{ product.name }}</h3>
        <p>{{ product.price }} ₽</p>
        <div class="card-actions">
          <button class="btn" @click="editProduct(product)">Ред.</button>
          <button class="btn btn-danger" @click="removeProductWithConfirm(product.id)">Удалить</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="tab === 'masterclasses'">
    <div class="card admin-form">
      <h2>{{ editingMCId ? 'Редактировать мастер-класс' : 'Добавить мастер-класс' }}</h2>
      <div class="form-group">
        <input v-model="mcForm.theme" placeholder="Тема" />
      </div>
      <div class="form-group">
        <input v-model="mcForm.description" placeholder="Описание" />
      </div>
      <div class="form-group">
        <input type="date" v-model="mcForm.date" />
      </div>
      <div class="form-group">
        <input v-model.number="mcForm.price" type="number" placeholder="Цена" />
      </div>
      <div class="form-group">
        <input v-model.number="mcForm.places" type="number" placeholder="Количество мест" />
      </div>
      <button class="btn" @click="saveMC">Сохранить</button>
    </div>

    <div class="catalog-grid">
      <div v-for="mc in masterClasses" :key="mc.id" class="card">
        <img
          :src="mc.image || '/images/placeholder.jpg'"
          :alt="mc.theme"
          class="card-img"
        />
        <h3>{{ mc.theme }}</h3>
        <p>{{ mc.date }}</p>
        <p>{{ mc.price }} ₽</p>
        <div class="card-actions">
          <button class="btn" @click="editMC(mc)">Ред.</button>
          <button class="btn btn-danger" @click="removeMCWithConfirm(mc.id)">Удалить</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="tab === 'users'">
    <div class="catalog-grid">
      <div v-for="user in users" :key="user.id" class="card">
        <h3>{{ user.login }}</h3>
        <p>{{ user.email }}</p>
        <p>Роль: <strong>{{ user.role }}</strong></p>
        <select @change="updateUserRole(user.id, ($event.target).value)" :value="user.role">
          <option value="user">Пользователь</option>
          <option value="florist">Флорист</option>
          <option value="admin">Администратор</option>
        </select>
        <button class="btn btn-danger" @click="deleteUserWithConfirm(user.id)">Удалить</button>
      </div>
    </div>
  </div>

  <div v-if="tab === 'orders'">
    <div v-if="orders.length === 0" class="empty">Заказов пока нет</div>
    <div v-for="order in orders" :key="order.id" class="card" style="margin-bottom:1rem">
      <p><strong>Заказ #{{ order.id }}</strong></p>
      <p>Пользователь: {{ order.userLogin }}</p>
      <p>Сумма: {{ order.total }} ₽</p>
      <p>Статус: {{ order.status }}</p>
      <select @change="updateOrderStatus(order.id, ($event.target).value)" :value="order.status">
        <option value="Новый">Новый</option>
        <option value="Подтверждён">Подтверждён</option>
        <option value="Отменён">Отменён</option>
      </select>
      <ul>
        <li v-for="item in order.items" :key="item.id">
          {{ item.name || item.theme }} ({{ item.price }} ₽) x{{ item.quantity }}
        </li>
      </ul>
    </div>
  </div>

  <div v-if="tab === 'groupcards'">
    <div v-if="groupCards.length === 0" class="empty">Групповых карточек пока нет</div>
    <div v-for="card in groupCards" :key="card.id" class="card" style="margin-bottom:1rem">
      <p><strong>Карточка #{{ card.id }}</strong></p>
      <p>Инициатор: {{ card.initiator }}</p>
      <p>Сумма: {{ card.total }} ₽</p>
      <p>Статус: {{ card.active ? 'Активна' : 'Завершена' }}</p>
      <ul>
        <li v-for="p in card.participants" :key="p.login">
          {{ p.login }} – {{ p.status === 'paid' ? 'Оплачено' : p.status === 'pending' ? 'Ожидает' : 'Не оплачено' }}
        </li>
      </ul>
    </div>
  </div>
</template>