<template>
  <v-dialog
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event, sendLogin)"
    width="300px"
  >
    <v-card class="pa-0">
      <v-alert class="py-6 pr-8" :text="text" :type="type" />
      <v-btn
        icon
        size="x-small"
        color="#B00020"
        variant="plain"
        class="close-btn"
        @click="$emit('update:modelValue', false, sendLogin)"
      >
        <v-icon class="text-white">mdi-close</v-icon>
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  modelValue: Boolean,
  text: String,
  type: {
    type: String,
    default: "info",
  },
  sendLogin: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}
</style>
