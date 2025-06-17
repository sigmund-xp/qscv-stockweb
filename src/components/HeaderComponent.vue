<template>
  <v-toolbar height="60" class="text-grey-lighten-1 px-2" color="teal-darken-3">
    <div class="d-flex align-center flex-grow-1 ml-4">
      <div class="text-left">
        <h1>Stock</h1>
      </div>
    </div>
    <v-spacer />
    <v-btn icon="mdi-home" color="grey-lighten-1" @click="goHome" />
    <v-btn icon="mdi-logout" color="grey-lighten-1" @click="logout" />
  </v-toolbar>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";
import { useUIStore } from "@/stores/ui.js";
import AuthService from "@/services/AuthService.js";

const router = useRouter();
const auth = useAuthStore();
const ui = useUIStore();

const goHome = () => router.push("/dashboard");

const logout = async () => {
  try {
    ui.startLoading();
    await AuthService.logout(auth.token);
    await router.push("/");
  } catch (error) {
    console.log(error);
  } finally {
    ui.stopLoading();
  }
};
</script>

<style scoped></style>
