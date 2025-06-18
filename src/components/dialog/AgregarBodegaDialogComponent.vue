<template>
  <v-dialog
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    width="500px"
    persistent
  >
    <v-card class="pa-5" color="grey-lighten-1">
      <v-card-title class="teal-darken-3">Agregar Bodega</v-card-title>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="bodega.name"
            ref="bodegaName"
            class="teal-darken-3"
            label="Nombre"
            required
          />
        </v-col>
        <v-col cols="12">
          <v-combobox
            v-model="bodega.province"
            :items="[
              'Buenos Aires',
              'Catamarca',
              'Chaco',
              'Chubut',
              'Córdoba',
              'Corrientes',
              'Entre Ríos',
              'Formosa',
              'Jujuy',
              'La Pampa',
              'La Rioja',
              'Mendoza',
              'Misiones',
              'Neuquén',
              'Río Negro',
              'Salta',
              'San Juan',
              'San Luis',
              'Santa Cruz',
              'Santa Fe',
              'Santiago del Estero',
              'Tierra del Fuego, Antártida e Islas del Atlántico Sur',
              'Tucumán',
              'Ciudad Autónoma de Buenos Aires',
            ]"
            label="Selecciona un provincia"
            variant="outlined"
            color="teal-darken-3"
            :menu-props="{
              contentClass: 'custom-combobox-menu',
              color: 'teal-darken-3',
            }"
          />
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
const bodegaName = ref(null);

const bodega = reactive({
  name: "",
  province: "",
});

watch(
  () => props.modelValue,
  async (val) => {
    dialog.value = val;
    if (val) {
      bodega.name = "";
      bodega.province = "";
      await nextTick();
      if (bodegaName.value) {
        bodegaName.value.focus();
      }
    }
  }
);

watch(dialog, (val) => {
  emit("update:modelValue", val);
});

const agregar = () => {
  if (validBodega(bodega)) {
    emit("created", { ...bodega });
  }
};
const validBodega = (bodega) => {
  let message = "";
  if (bodega.name === "") {
    message = "El nombre no puede estar vacio";
  } else if (bodega.province === "") {
    message = "Debe seleccionar una Provincia";
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
