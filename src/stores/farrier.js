import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFarriersStore = defineStore('farriers', () => {
  const farriers = ref([])

  const getFarriers = computed(() =>
    farriers
  )

  function searchFarriers() {
    farriers.value = [
      { title: "Caballo Brillante", subtitle: "Propietario: Juan Pérez", image: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" },
      { title: "Tornado", subtitle: "Propietario: Ana López", image: "https://cdn.vuetifyjs.com/images/cards/house.jpg" },
      { title: "Estrella", subtitle: "Propietario: Pedro García", image: "https://cdn.vuetifyjs.com/images/cards/road.jpg" },
      { title: "Tornado", subtitle: "Propietario: Ana López", image: "https://cdn.vuetifyjs.com/images/cards/house.jpg" },
      { title: "Estrella", subtitle: "Propietario: Pedro García", image: "https://cdn.vuetifyjs.com/images/cards/road.jpg" }
    ]
  }

  return { farriers, searchFarriers, getFarriers }
})
