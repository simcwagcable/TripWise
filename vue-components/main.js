import { createApp, ref, computed } from 'vue'

// Определяем компоненты
const TripSearch = {
  template: `
    <div class="search-form" role="search">
      <form @submit.prevent="handleSearch">
        <div class="pure-g" style="gap: 1rem 0;">
          <div class="pure-u-1 pure-u-md-1-3">
            <input type="text" v-model="form.from" placeholder="Откуда">
          </div>
          <div class="pure-u-1 pure-u-md-1-3">
            <input type="text" v-model="form.to" placeholder="Куда">
          </div>
          <div class="pure-u-1 pure-u-md-1-3">
            <input type="date" v-model="form.date">
          </div>
        </div>
        
        <div class="pure-g" style="margin-top: 1rem;">
          <div class="pure-u-1">
            <fieldset>
              <legend class="sr-only">Вид транспорта</legend>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <label class="pure-radio">
                  <input type="radio" value="avia" v-model="form.transport"> ✈️ Авиа
                </label>
                <label class="pure-radio">
                  <input type="radio" value="train" v-model="form.transport"> 🚂 ЖД
                </label>
                <label class="pure-radio">
                  <input type="radio" value="bus" v-model="form.transport"> 🚌 Автобусы
                </label>
              </div>
            </fieldset>
          </div>
        </div>
        
        <button type="submit" class="pure-button pure-button-primary button-large" style="width: 100%; margin-top: 1.5rem;">
          <i class="fas fa-search"></i> Найти билеты
        </button>
      </form>
    </div>
  `,
  setup() {
    const form = ref({
      from: 'Москва',
      to: 'Сочи',
      date: '2026-06-15',
      transport: 'avia'
    })
    
    const handleSearch = () => {
      console.log('Поиск:', form.value)
      alert(`Поиск билетов: ${form.value.from} → ${form.value.to}`)
    }
    
    return { form, handleSearch }
  }
}

const TripCard = {
  props: ['trip'],
  emits: ['toggle-favorite'],
  template: `
    <div class="trip-card" :class="{ favorite: trip.favorite }">
      <div class="trip-icon">
        <i :class="transportIcon"></i>
      </div>
      <div class="trip-info">
        <h3>{{ trip.company }}</h3>
        <p>{{ trip.from }} → {{ trip.to }} · {{ trip.time }}</p>
      </div>
      <div class="trip-actions">
        <div class="trip-price">{{ trip.price.toLocaleString() }} ₽</div>
        <button @click="$emit('toggle-favorite', trip.id)" class="favorite-btn">
          {{ trip.favorite ? '❤️' : '🤍' }}
        </button>
        <button class="pure-button pure-button-primary select-btn">Выбрать</button>
      </div>
    </div>
  `,
  computed: {
    transportIcon() {
      switch (this.trip.transport) {
        case 'avia': return 'fas fa-plane'
        case 'train': return 'fas fa-train'
        case 'bus': return 'fas fa-bus'
        default: return 'fas fa-globe'
      }
    }
  }
}

const TripFilters = {
  props: ['transport', 'sortBy', 'trips'],
  emits: ['update:transport', 'update:sortBy'],
  template: `
    <div class="filters-panel">
      <div class="pure-g">
        <div class="pure-u-1 pure-u-md-1-2">
          <div class="filter-group">
            <label>Транспорт:</label>
            <div class="filter-buttons">
              <button 
                v-for="option in transportOptions" 
                :key="option.value"
                :class="['filter-btn', { active: transport === option.value }]"
                @click="$emit('update:transport', option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="pure-u-1 pure-u-md-1-2">
          <div class="filter-group">
            <label>Сортировка:</label>
            <div class="filter-buttons">
              <button 
                v-for="option in sortOptions" 
                :key="option.value"
                :class="['filter-btn', { active: sortBy === option.value }]"
                @click="$emit('update:sortBy', option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="stats">
        <span>📊 Найдено: {{ trips.length }} направлений</span>
      </div>
    </div>
  `,
  setup() {
    const transportOptions = [
      { value: 'all', label: '🚀 Все' },
      { value: 'avia', label: '✈️ Авиа' },
      { value: 'train', label: '🚂 ЖД' },
      { value: 'bus', label: '🚌 Автобусы' }
    ]
    
    const sortOptions = [
      { value: 'price', label: '💰 По цене' },
      { value: 'time', label: '⏰ По времени' }
    ]
    
    return { transportOptions, sortOptions }
  }
}

// Создаём приложение
const app = createApp({
  setup() {
    const trips = ref([
      {
        id: 1,
        from: 'Москва',
        to: 'Сочи',
        time: '10:00 → 12:30',
        price: 5990,
        transport: 'avia',
        company: 'S7 Airlines',
        favorite: false
      },
      {
        id: 2,
        from: 'Москва',
        to: 'Сочи',
        time: '23:00 → 10:30',
        price: 3200,
        transport: 'train',
        company: 'РЖД',
        favorite: false
      },
      {
        id: 3,
        from: 'Санкт-Петербург',
        to: 'Москва',
        time: '08:00 → 10:15',
        price: 4500,
        transport: 'avia',
        company: 'Аэрофлот',
        favorite: false
      },
      {
        id: 4,
        from: 'Москва',
        to: 'Казань',
        time: '14:30 → 17:45',
        price: 3800,
        transport: 'train',
        company: 'РЖД',
        favorite: false
      }
    ])
    
    const selectedTransport = ref('all')
    const sortBy = ref('price')
    
    // Загрузка из localStorage
    const saved = localStorage.getItem('tripwise-favorites')
    if (saved) {
      const favorites = JSON.parse(saved)
      trips.value.forEach(trip => {
        if (favorites.includes(trip.id)) {
          trip.favorite = true
        }
      })
    }
    
    // Сохранение избранного
    const saveFavorites = () => {
      const favorites = trips.value.filter(t => t.favorite).map(t => t.id)
      localStorage.setItem('tripwise-favorites', JSON.stringify(favorites))
    }
    
    const toggleFavorite = (id) => {
      const trip = trips.value.find(t => t.id === id)
      if (trip) {
        trip.favorite = !trip.favorite
        saveFavorites()
      }
    }
    
    // Фильтрация и сортировка
    const filteredTrips = computed(() => {
      let result = [...trips.value]
      
      if (selectedTransport.value !== 'all') {
        result = result.filter(t => t.transport === selectedTransport.value)
      }
      
      if (sortBy.value === 'price') {
        result.sort((a, b) => a.price - b.price)
      } else if (sortBy.value === 'time') {
        result.sort((a, b) => {
          const hourA = parseInt(a.time.split(':')[0])
          const hourB = parseInt(b.time.split(':')[0])
          return hourA - hourB
        })
      }
      
      return result
    })
    
    return {
      trips,
      selectedTransport,
      sortBy,
      filteredTrips,
      toggleFavorite
    }
  }
})

// Регистрируем компоненты
app.component('TripSearch', TripSearch)
app.component('TripCard', TripCard)
app.component('TripFilters', TripFilters)

// Монтируем приложение в существующий элемент
app.mount('#vue-app')