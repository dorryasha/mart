<script setup>
import { ref } from 'vue'
import { useCatalog } from '../stores/useCatalog'
import { useUsers } from '../stores/useUsers'
import { useOrders } from '../stores/useOrders'
import { useGroupCards } from '../stores/useGroupCards'

const { products, masterClasses, addProduct, updateProduct, removeProduct, addMasterClass, updateMasterClass, removeMasterClass } = useCatalog()
const { users, updateUserRole, deleteUser } = useUsers()
const { orders, updateOrderStatus } = useOrders()
const { groupCards } = useGroupCards()

const tab = ref('products')

// Формы для товаров и мастер-классов
const productForm = ref({ name: '', composition: '', price: 0, type: 'букет', occasion: 'любой', image: '' })
const editingProductId = ref(null)

function saveProduct() {
  if (editingProductId.value) {
    updateProduct(editingProductId.value, productForm.value)
    editingProductId.value = null
  } else {
    addProduct({ ...productForm.value, price: Number(productForm.value.price) })
  }
  productForm.value = { name: '', composition: '', price: 0, type: 'букет', occasion: 'любой', image: '' }
}

function editProduct(product) {
  editingProductId.value = product.id
  productForm.value = { ...product }
}

const mcForm = ref({ theme: '', description: '', date: '', price: 0, places: 10, image: '' })
const editingMCId = ref(null)

function saveMC() {
  if (editingMCId.value) {
    updateMasterClass(editingMCId.value, mcForm.value)
    editingMCId.value = null
  } else {
    addMasterClass({ ...mcForm.value, price: Number(mcForm.value.price), places: Number(mcForm.value.places) })
  }
  mcForm.value = { theme: '', description: '', date: '', price: 0, places: 10, image: '' }
}

function editMC(mc) {
  editingMCId.value = mc.id
  mcForm.value = { ...mc }
}
</script>

<template>
  <h1>Административная панель</h1>
  <div style="display:flex; gap:1rem; margin-bottom:1rem;">
    <button @click="tab = 'products'" :class="{ btn: true, 'btn-warning': tab === 'products' }">Товары</button>
    <button @click="tab = 'masterclasses'" :class="{ btn: true, 'btn-warning': tab === 'masterclasses' }">Мастер-классы</button>
    <button @click="tab = 'users'" :class="{ btn: true, 'btn-warning': tab === 'users' }">Пользователи</button>
    <button @click="tab = 'orders'" :class="{ btn: true, 'btn-warning': tab === 'orders' }">Заказы</button>
    <button @click="tab = 'groupcards'" :class="{ btn: true, 'btn-warning': tab === 'groupcards' }">Групповые карточки</button>
  </div>

  <!-- Товары -->
  <div v-if="tab === 'products'">
    <h2>Товары</h2>
    <div class="card" style="margin-bottom:1rem">
      <h3>{{ editingProductId ? 'Редактировать' : 'Добавить' }} товар</h3>
      <input v-model="productForm.name" placeholder="Название" />
      <input v-model="productForm.composition" placeholder="Состав" />
      <input v-model.number="productForm.price" type="number" placeholder="Цена" />
      <select v-model="productForm.type">
        <option value="букет">Букет</option>
        <option value="цветок">Цветок</option>
        <option value="композиция">Композиция</option>
      </select>
      <select v-model="productForm.occasion">
        <option value="любой">Любой</option>
        <option value="день рождения">День рождения</option>
        <option value="свадьба">Свадьба</option>
        <option value="благодарность">Благодарность</option>
      </select>
      <button @click="saveProduct" class="btn">Сохранить</button>
    </div>
    <div class="catalog-grid">
      <div v-for="product in products" :key="product.id" class="card">
        <h3>{{ product.name }}</h3>
        <p>{{ product.price }} ₽</p>
        <button @click="editProduct(product)" class="btn">Ред.</button>
        <button @click="removeProduct(product.id)" class="btn-danger">Удалить</button>
      </div>
    </div>
  </div>

  <!-- Мастер-классы -->
  <div v-if="tab === 'masterclasses'">
    <h2>Мастер-классы</h2>
    <div class="card" style="margin-bottom:1rem">
      <h3>{{ editingMCId ? 'Редактировать' : 'Добавить' }} мастер-класс</h3>
      <input v-model="mcForm.theme" placeholder="Тема" />
      <input v-model="mcForm.description" placeholder="Описание" />
      <input type="date" v-model="mcForm.date" />
      <input v-model.number="mcForm.price" type="number" placeholder="Цена" />
      <input v-model.number="mcForm.places" type="number" placeholder="Кол-во мест" />
      <button @click="saveMC" class="btn">Сохранить</button>
    </div>
    <div class="catalog-grid">
      <div v-for="mc in masterClasses" :key="mc.id" class="card">
        <h3>{{ mc.theme }}</h3>
        <p>{{ mc.date }} | {{ mc.price }} ₽</p>
        <button @click="editMC(mc)" class="btn">Ред.</button>
        <button @click="removeMasterClass(mc.id)" class="btn-danger">Удалить</button>
      </div>
    </div>
  </div>

  <!-- Пользователи -->
  <div v-if="tab === 'users'">
    <h2>Пользователи</h2>
    <div v-for="user in users" :key="user.id" class="card" style="margin-bottom:1rem">
      <p><strong>{{ user.login }}</strong> ({{ user.email }}) – {{ user.role }}</p>
      <select @change="updateUserRole(user.id, ($event.target).value)" :defaultValue="user.role">
        <option value="user">Пользователь</option>
        <option value="florist">Флорист</option>
        <option value="admin">Администратор</option>
      </select>
      <button @click="deleteUser(user.id)" class="btn-danger">Удалить</button>
    </div>
  </div>

  <!-- Заказы -->
  <div v-if="tab === 'orders'">
    <h2>Заказы</h2>
    <div v-for="order in orders" :key="order.id" class="card" style="margin-bottom:1rem">
      <p>Заказ #{{ order.id }} | Пользователь: {{ order.userLogin }}</p>
      <p>Сумма: {{ order.total }} ₽ | Статус: {{ order.status }}</p>
      <select @change="updateOrderStatus(order.id, ($event.target).value)" :value="order.status">
        <option value="Новый">Новый</option>
        <option value="Подтверждён">Подтверждён</option>
        <option value="Отменён">Отменён</option>
      </select>
    </div>
  </div>

  <!-- Групповые карточки -->
  <div v-if="tab === 'groupcards'">
    <h2>Групповые карточки</h2>
    <div v-for="card in groupCards" :key="card.id" class="card" style="margin-bottom:1rem">
      <p>Карточка #{{ card.id }} | Инициатор: {{ card.initiator }} | Сумма: {{ card.total }} ₽</p>
      <p>Статус: {{ card.active ? 'Активна' : 'Завершена' }}</p>
      <ul>
        <li v-for="p in card.participants" :key="p.login">
          {{ p.login }} – {{ p.status }}
        </li>
      </ul>
    </div>
  </div>
</template>