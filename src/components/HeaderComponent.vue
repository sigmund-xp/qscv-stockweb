<template>
  <v-toolbar height="100" class="text-white gold-border px-2" color="#111111">
    <div class="d-none d-sm-flex align-left" style="min-width: 200px">
      <v-img
        :src="require('../assets/logo-lm-header.png')"
        height="80"
        contain
        @click="router.push('/dashboard')"
      />
    </div>
    <div class="d-flex d-sm-none align-left" style="min-width: 120px">
      <v-img :src="require('../assets/logo-lm-header.png')" height="50" contain />
    </div>
    <div class="d-flex align-center flex-grow-1 ml-4">
      <div class="user-info text-left">
        <div class="username">{{ userInfo.info.name }}</div>
        <div class="user-role">{{ userInfo.info.role.description }}</div>
      </div>
    </div>
    <v-spacer />
    <v-btn icon="mdi-menu" color="#C5A044" @click="drawer = true"></v-btn>
  </v-toolbar>
  <v-navigation-drawer
    v-model="drawer"
    location="right"
    temporary
    style="top: 73px"
    color="#111111"
  >
    <v-list>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        class="text-gold"
        :prepend-icon="item.icon"
        @click="handleMenuClick(item)"
      >
        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { watch, defineEmits, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import { useUserInfoStore } from "../stores/user.js";
import AuthService from "../services/AuthService.js";

const emit = defineEmits(["showAddOwner", "showAddVeterinarian"]);

const drawer = ref(false);
const router = useRouter();
const auth = useAuthStore();
const userInfo = useUserInfoStore();

const items = ref([]);

const buildMenu = (rol) => {
  items.value = [];
  items.value.push({
    text: "Inicio",
    icon: "mdi-home",
    action: "goHome",
  });
  items.value.push({
    text: "Mi perfil",
    icon: "mdi-card-account-details-outline",
    action: "goProfile",
  });
  if (rol[0] === "V") {
    items.value.push({
      text: "Historia clinica",
      icon: "mdi-file-document-multiple-outline",
      action: "goHome",
    });
  } else {
    if (rol[0] === "A") {
      items.value.push({
        text: "Agregar un Propietario",
        icon: "mdi-account-plus-outline",
        action: "addOwner",
      });
    } else {
      items.value.push({
        text: "Agregar un Caballo",
        icon: "mdi-horse-variant",
        action: "addHorse",
      });
    }
    items.value.push({
      text: "Agregar un Veterinario",
      icon: "mdi-medical-bag",
      action: "addVeterinarian",
    });
    items.value.push({
      text: "Herradores",
      icon: "mdi-horseshoe",
      action: "goFarrierList",
    });
  }
  items.value.push({ text: "Cerrar sesión", icon: "mdi-logout", action: "logout" });
};

watch(
  () => userInfo.info,
  (val) => {
    if (val && val.role?.description) {
      buildMenu(val.role.description);
    }
  },
  { immediate: true }
);

const handleMenuClick = (item) => {
  switch (item.action) {
    case "goHome":
      router.push("/dashboard");
      break;
    case "addOwner":
      drawer.value = false;
      emit("showAddOwner", true);
      break;
    case "addVeterinarian":
      drawer.value = false;
      emit("showAddVeterinarian", true);
      break;
    case "goProfile":
      router.push("/profile");
      break;
    case "goFarrierList":
      router.push("/farrier");
      break;
    case "logout":
      logout();
      router.push("/login");
      break;
  }
};

const logout = async () => {
  try {
    await AuthService.logout(auth.token);
    auth.clearToken();
    router.push("/login");
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
.user-info {
  color: #c5a044;
  font-size: 0.95rem;
  line-height: 1.2;
  max-width: 160px;
}
.username {
  font-weight: bold;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-style: italic;
  font-size: 0.85rem;
  color: #c5a044;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 600px) {
  .user-info {
    max-width: 300px;
  }

  .username {
    font-size: 1.1rem;
  }

  .user-role {
    font-size: 0.95rem;
  }
}

@media (min-width: 960px) {
  .username {
    font-size: 1.2rem;
  }

  .user-role {
    font-size: 1rem;
  }
}
</style>
