import { ref, watchEffect } from 'vue'

const STORAGE_PRODUCTS = 'mart_products'
const STORAGE_MASTERCLASSES = 'mart_masterclasses'

const defaultProducts = [
  { id: 'p1', name: 'Букет "Нежность"', composition: 'Розы, пионы, эвкалипт', price: 3500, type: 'букет', occasion: 'день рождения', image: '/mart/images/bouquet1.jpg' },
  { id: 'p2', name: 'Роза красная', composition: 'Одна роза', price: 500, type: 'цветок', occasion: 'любой', image: '/mart/images/rose1.jpg' },
  { id: 'p3', name: 'Букет "Свадебный"', composition: 'Белые розы, фрезии', price: 4500, type: 'букет', occasion: 'свадьба', image: '/mart/images/bouquet2.jpg' },
  { id: 'p4', name: 'Композиция "Осень"', composition: 'Хризантемы, ягоды', price: 2800, type: 'композиция', occasion: 'благодарность', image: '/mart/images/composition1.jpg' },
]

const defaultMasterClasses = [
  { id: 'm1', theme: 'Основы флористики', date: '2026-05-15', price: 2000, places: 10, description: 'Научитесь составлять букеты', image: '/mart/images/masterclass1.jpg' },
  { id: 'm2', theme: 'Свадебная флористика', date: '2026-05-20', price: 3000, places: 8, description: 'Букет невесты и бутоньерка', image: '/mart/images/wedding.jpg' },
  { id: 'm3', theme: 'Цветочные композиции', date: '2026-06-01', price: 2500, places: 12, description: 'Создаём интерьерные композиции', image: '/mart/images/masterclass2.jpg' },
]

const products = ref([])
const masterClasses = ref([])

function loadData() {
  let prods = localStorage.getItem(STORAGE_PRODUCTS)
  if (!prods) {
    localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(defaultProducts))
    prods = JSON.stringify(defaultProducts)
  }
  products.value = JSON.parse(prods)

  let mcs = localStorage.getItem(STORAGE_MASTERCLASSES)
  if (!mcs) {
    localStorage.setItem(STORAGE_MASTERCLASSES, JSON.stringify(defaultMasterClasses))
    mcs = JSON.stringify(defaultMasterClasses)
  }
  masterClasses.value = JSON.parse(mcs)
}
loadData()

watchEffect(() => {
  localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products.value))
})
watchEffect(() => {
  localStorage.setItem(STORAGE_MASTERCLASSES, JSON.stringify(masterClasses.value))
})

export function useCatalog() {
  function addProduct(product) {
    product.id = 'p' + Date.now()
    products.value.push(product)
  }
  function updateProduct(id, data) {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx >= 0) products.value[idx] = { ...products.value[idx], ...data }
  }
  function removeProduct(id) {
    products.value = products.value.filter(p => p.id !== id)
  }

  function addMasterClass(mc) {
    mc.id = 'm' + Date.now()
    masterClasses.value.push(mc)
  }
  function updateMasterClass(id, data) {
    const idx = masterClasses.value.findIndex(m => m.id === id)
    if (idx >= 0) masterClasses.value[idx] = { ...masterClasses.value[idx], ...data }
  }
  function removeMasterClass(id) {
    masterClasses.value = masterClasses.value.filter(m => m.id !== id)
  }

  return {
    products,
    masterClasses,
    addProduct,
    updateProduct,
    removeProduct,
    addMasterClass,
    updateMasterClass,
    removeMasterClass
  }
}