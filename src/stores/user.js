import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserInfoStore = defineStore('userInfo', () => {
  const info = ref('')
  const setUserInfo = (newInfo) => (info.value = newInfo)

  return { info, setUserInfo }
})
