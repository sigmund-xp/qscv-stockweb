<template>
  <v-container class="list-container">
    <v-row>
      <v-col
        v-for="(horse, index) in horsesStore.horses"
        :key="index"
        cols="12"
        sm="6"
        md="3"
        lg="3"
      >
        <v-card
          class="ma-3 hover-card text-black"
          color="#C5A044"
          :subtitle="horse.subtitle"
          :title="horse.title"
          hover
          ripple
          @click="handleCardClick(index)"
        >
          <template v-slot:prepend>
            <v-icon color="#000000" size="large" icon="mdi-horse-variant" />
          </template>
          <v-img height="200px" :src="horse.image" cover></v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useHorsesStore } from "@/stores/horses";
const horsesStore = useHorsesStore();

const handleCardClick = (index) => {
  console.log(horsesStore.horses[index]);
};
</script>

<style scoped>
.list-container {
  max-width: none;
}
.hover-card {
  cursor: pointer;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.hover-card:hover {
  transform: scale(1.05) rotate(-1deg) translateY(-8px);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.4);
}
</style>
