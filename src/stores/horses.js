import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useHorsesStore = defineStore('horses', () => {
  const horses = ref([])

  const getHorses = computed(() =>
    horses
  )

  function searchHorses(horseName, ownerName) {
    console.log(horseName.value)
    console.log(ownerName.value)
    horses.value = [
      { title: "Caballo Brillante", subtitle: "Propietario: Juan Pérez", image: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" },
      { title: "Tornado", subtitle: "Propietario: Ana López", image: "https://cdn.vuetifyjs.com/images/cards/house.jpg" },
      { title: "Estrella", subtitle: "Propietario: Pedro García", image: "https://cdn.vuetifyjs.com/images/cards/road.jpg" },
      { title: "Tornado", subtitle: "Propietario: Ana López", image: "https://cdn.vuetifyjs.com/images/cards/house.jpg" },
      { title: "Estrella", subtitle: "Propietario: Pedro García", image: "https://cdn.vuetifyjs.com/images/cards/road.jpg" }
    ]
    console.log(horses.value)
  }

  function searchVeteHorses(horseName, ownerName) {
    console.log(horseName.value)
    console.log(ownerName.value)
    horses.value = [
      { title: "Caballo Brillante", subtitle: "Propietario: Juan Pérez", image: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" },
      { title: "Tornado", subtitle: "Propietario: Ana López", image: "https://cdn.vuetifyjs.com/images/cards/house.jpg" },
      { title: "Estrella", subtitle: "Propietario: Pedro García", image: "https://cdn.vuetifyjs.com/images/cards/road.jpg" },
      { title: "Tornado", subtitle: "Propietario: Ana López", image: "https://cdn.vuetifyjs.com/images/cards/house.jpg" },
      { title: "Estrella", subtitle: "Propietario: Pedro García", image: "https://cdn.vuetifyjs.com/images/cards/road.jpg" }
    ]
    console.log(horses.value)
  }

  function searchOwnerHorses(horseName) {
    console.log(horseName.value)
    horses.value = [
      { title: "Caballo Brillante", subtitle: "Propietario: Juan Pérez", image: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" },
      { title: "Tornado", subtitle: "Propietario: Ana López", image: "https://cdn.vuetifyjs.com/images/cards/house.jpg" },
      { title: "Estrella", subtitle: "Propietario: Pedro García", image: "https://cdn.vuetifyjs.com/images/cards/road.jpg" },
      { title: "Tornado", subtitle: "Propietario: Ana López", image: "https://cdn.vuetifyjs.com/images/cards/house.jpg" },
      { title: "Estrella", subtitle: "Propietario: Pedro García", image: "https://cdn.vuetifyjs.com/images/cards/road.jpg" }
    ]
    console.log(horses.value)
  }

  return { horses, searchHorses, searchVeteHorses, searchOwnerHorses, getHorses }
})
