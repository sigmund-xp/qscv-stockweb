<template>
  <v-row class="my-0" align="center">
    <v-col cols="12" sm="5">
      <v-text-field
        v-model="horseName"
        dense
        hide-details
        density="comfortable"
        class="text-gold"
        label="Nombre del caballo"
      />
    </v-col>
    <v-col cols="12" sm="5">
      <v-text-field
        v-if="rol != 'P'"
        v-model="ownerName"
        dense
        hide-details
        density="comfortable"
        class="text-gold"
        label="Propietario"
      />
    </v-col>
    <v-col cols="12" sm="2" class="d-flex justify-end">
      <v-btn
        size="small"
        color="#C5A044"
        class="text-black"
        prepend-icon="mdi-magnify"
        elevation="0"
        rounded
        @click="searchHorses()"
        >Buscar</v-btn
      >
    </v-col>
  </v-row>
</template>

<script setup>
import { watch, ref } from "vue";
import { useHorsesStore } from "../stores/horses.js";
import { useUserInfoStore } from "../stores/user.js";

const store = useHorsesStore();

const horseName = ref("");
const ownerName = ref("");
const rol = ref("");

const userInfo = useUserInfoStore();

watch(
  () => userInfo.info,
  (info) => {
    if (info?.role?.description) {
      rol.value = info.role.description[0];
    }
  },
  { immediate: true } // para que se ejecute también si ya está cargado
);

const searchHorses = () => {
  switch (rol.value) {
    case "A":
      store.searchHorses(horseName, ownerName);
      break;
    case "P":
      store.searchOwnerHorses(horseName);
      break;
    case "V":
      store.searchVeteHorses(horseName, ownerName);
      break;
  }
};
</script>

<style scoped>
.filters {
  padding-top: 0.5rem;
  padding-right: 2rem;
  padding-bottom: 1rem;
  padding-left: 2rem;
  background-color: #111;
  border-bottom: 1px solid #c5a044;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-end;
}
.inputFilter {
  display: flex;
  flex-direction: column;
  flex: 1 1 200px;
}
.inputFilter label {
  color: #c5a044;
  margin-bottom: 0.3rem;
}
.inputFilter input {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: 1px solid #c5a044;
  background-color: #111;
  color: #fff;
}
.buttonFilter {
  display: flex;
  flex-direction: column;
}
.buttonFilter label {
  visibility: hidden;
}
.buttonFilter button {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: 1px solid #c5a044;
  background-color: #c5a044;
  color: #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
