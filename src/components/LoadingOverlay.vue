<template>
  <div class="loading-overlay">
    <v-container class="fill-height d-flex align-center justify-center">
      <v-progress-circular indeterminate size="64" color="teal-darken-3" />
    </v-container>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(11, 11, 11, 0.8);
  z-index: 9999;
}
</style>
