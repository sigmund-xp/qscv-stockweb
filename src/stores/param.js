import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useParamsStore = defineStore('params', () => {
  const params = ref({
    pelaje: [],
    raza: [],
    provincias: [],
    localidades: [],
    especialidades: []
  })

  const setParams = (newParams) => {
    const updatedParams = { ...params.value } // Copia del estado
    
    newParams.params.forEach(param => {
      const map = {
        'PEL': 'pelajes',
        'RAZ': 'razas',
        'PRO': 'provincias',
        'LOC': 'localidades',
        'ESP': 'especialidades'
      }
      
      if (map[param.kind]) {
        updatedParams[map[param.kind]] = param.items
      }
    })
    
    params.value = updatedParams
  }

  return { params, setParams }
})