<template>
  <v-container class="gold-border filter-container py-6" fluid>
    <v-row justify="center" align="center" dense>
      <v-col
        cols="12"
        sm="4"
        class="d-flex justify-center"
        v-for="(item, index) in menuItems"
        :key="index"
      >
        <div class="menu-wrapper">
          <v-btn
            class="menu-wrapper menu-button fill-height fill-width"
            :color="item.color"
            elevation="6"
            @click="item.action"
          >
            <div class="menu-content">
              <v-icon size="60">{{ item.icon }}</v-icon>
              <span class="menu-label">{{ item.label }}</span>
            </div>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const menuItems = [
  {
    label: 'Stock',
    icon: 'mdi-bottle-wine',
    color: '#6A1B9A',
    action: () => router.push("/stock"),
  },
  {
    label: 'Bodegas',
    icon: 'mdi-warehouse',
    color: 'teal-darken-3',
    action: () => router.push("/bodegas"),
  },
  {
    label: 'Cepas',
    icon: 'mdi-fruit-grapes',
    color: 'teal-darken-3',
    action: () => router.push("/cepas"),
  },
];
</script>

<style scoped>
.menu-wrapper {
  aspect-ratio: 1 / 1;
  width: 200px;
}

@media (min-width: 600px) {
  .menu-wrapper {
    width: 240px;
  }
}

@media (min-width: 960px) {
  .menu-wrapper {
    width: 280px;
  }
}

.menu-button {
  border-radius: 20px;
  text-transform: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.menu-button:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.menu-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-label {
  margin-top: 12px;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
}
</style>
