<template>
  <v-dialog
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    max-width="400px"
    class="pa-6"
    transition="dialog-bottom-transition"
    persistent
  >
    <v-card class="grey-lighten-1">
      <v-card-title class="teal-darken-3 pa-4 pb-2">
        <v-icon class="mr-2">mdi-alert-outline</v-icon> Confirmar Eliminación
      </v-card-title>
      <v-card-text class="teal-darken-3 px-4 py-2">
        {{ props.text }}
      </v-card-text>
      <v-card-actions class="pa-4 pt-2">
        <v-btn
          color="teal-darken-3"
          variant="flat"
          class="text-grey-lighten-1"
          @click="deleteItem"
          >Eliminar</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn color="teal-darken-3" variant="outlined" @click="close">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, ref, watch, defineEmits } from "vue";

const props = defineProps({
  modelValue: Boolean,
  text: String,
});

const emit = defineEmits(["update:modelValue", "deleteItem"]);

const dialog = ref(false);

watch(
  () => props.deleteDialog,
  async (val) => {
    dialog.value = val;
  }
);

const close = () => {
  emit("update:modelValue", false);
};

const deleteItem = () => {
  emit("deleteItem");
};
</script>

<style scoped>
.v-card {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5) !important;
}
.teal-darken-3 {
  color: #00695c;
}
.grey-lighten-1 {
  background-color: #e0e0e0;
}
</style>
