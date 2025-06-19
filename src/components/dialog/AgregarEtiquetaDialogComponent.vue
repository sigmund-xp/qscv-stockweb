<template>
  <v-dialog
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    width="500px"
    persistent
  >
    <v-card class="pa-5" cxolor="grey-lighten-1">
      <v-card-title class="teal-darken-3">Agregar Etiqueta</v-card-title>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="etiqueta.name"
            ref="etiquetaName"
            class="teal-darken-3"
            label="Nombre"
            required
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="etiqueta.vintage"
            class="teal-darken-3"
            label="Añada"
            maxlength="4"
            @input="etiqueta.vintage = Number(soloNumeros(etiqueta.vintage))"
            required
          />
        </v-col>
        <v-col cols="12">
          <v-combobox
            v-model="etiqueta.type"
            :items="['Tinto', 'Blanco', 'Rosado', 'Naranjo', 'Espumoso', 'Dulce']"
            label="Selecciona un tipo de vino"
            variant="outlined"
            color="teal-darken-3"
            :menu-props="{
              contentClass: 'custom-combobox-menu',
              color: 'teal-darken-3',
            }"
          />
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="etiqueta.bodegaId"
            :items="bodegas"
            item-title="name"
            item-value="_id"
            label="Seleccione una bodega"
            variant="outlined"
            color="teal-darken-3"
            :menu-props="{
              contentClass: 'custom-combobox-menu',
              color: 'teal-darken-3',
            }"
          />
        </v-col>
        <v-col cols="12">
          <v-combobox
            v-model="etiqueta.cepas"
            chips
            multiple
            label="Composicion"
            :items="cepas"
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
  bodegas: Array,
  cepas: Array,
});

const emit = defineEmits(["update:modelValue", "alert", "created"]);

const dialog = ref(false);
const etiquetaName = ref(null);

const etiqueta = reactive({
  name: "",
  vintage: 0,
  type: "",
  bodegaId: "",
  cepas: [],
});

watch(
  () => props.modelValue,
  async (val) => {
    dialog.value = val;
    if (val) {
      etiqueta.name = "";
      etiqueta.vintage = 0;
      etiqueta.type = "";
      etiqueta.bodegaId = "";
      etiqueta.cepas = [];
      await nextTick();
      if (etiquetaName.value) {
        etiquetaName.value.focus();
      }
    }
  }
);

watch(dialog, (val) => {
  emit("update:modelValue", val);
});

const agregar = () => {
  if (validEtiqueta(etiqueta)) {
    emit("created", { ...etiqueta });
  }
};
const validEtiqueta = (etiqueta) => {
  let message = "";
  if (etiqueta.name === "") {
    message = "El nombre no puede estar vacio";
  } else if (etiqueta.vintage < 1970) {
    message = "La añada deber ser mayor que 1970";
  } else if (etiqueta.type === "") {
    message = "Debe seleccionar un Tipo de vino";
  } else if (etiqueta.bodegaId === "") {
    message = "Debe seleccionar una Bodega";
  } else if (etiqueta.cepas.length === 0) {
    message = "Debe seleccionar al menos una Cepa";
  }
  if (message !== "") {
    emit("alert", `Error de validación: ${message}`);
    return false;
  }
  return true;
};
const soloNumeros = (valor) => {
  return valor.replace(/\D/g, "");
};
</script>

<style scoped>
.teal-darken-3 {
  color: #00695c;
}
</style>
