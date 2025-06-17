<template>
  <v-dialog
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    width="500px"
    persistent
  >
    <v-card class="pa-5" color="grey-lighten-1">
      <v-card-title class="teal-darken-3">Agregar Cepa</v-card-title>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="cepa.name"
            ref="cepaName"
            class="teal-darken-3"
            label="Nombre"
            required
          />
        </v-col>
        <v-col cols="12">
          <v-radio-group v-model="cepa.type">
            <v-radio class="teal-darken-3" label="Uva Tinta" value="Tinta"></v-radio>
            <v-radio class="teal-darken-3" label="Uva Blanca" value="Blanca"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-card-actions class="px-5 pb-4">
        <v-btn
          color="teal-darken-3"
          variant="flat"
          class="text-grey-lighten-1"
          @click.prevent="agregar"
        >
          Agregar
        </v-btn>
        <v-spacer />
        <v-btn
          variant="outlined"
          color="teal-darken-3"
          @click.prevent="$emit('update:modelValue', false)"
          >Cancelar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, nextTick, ref, watch, defineEmits, reactive } from "vue";

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue", "alert", "created"]);

const dialog = ref(false);
const cepaName = ref(null);

const cepa = reactive({
  name: "",
  type: "",
});

watch(
  () => props.modelValue,
  async (val) => {
    dialog.value = val;
    if (val) {
      cepa.name = "";
      cepa.type = "";
      await nextTick();
      if (cepaName.value) {
        cepaName.value.focus();
      }
    }
  }
);

watch(dialog, (val) => {
  emit("update:modelValue", val);
});

const agregar = () => {
  if (validCepa(cepa)) {
    emit("created", { ...cepa });
  }
};
const validCepa = (cepa) => {
  let message = "";
  if (cepa.name === "") {
    message = "El nombre no puede estar vacio";
  } else if (cepa.type === "") {
    message = "Debe seleccionar un tipo";
  }
  if (message !== "") {
    emit("alert", `Error de validación: ${message}`);
    return false;
  }
  return true;
};
</script>

<style scoped>
.teal-darken-3 {
  color: #00695c;
}
</style>
