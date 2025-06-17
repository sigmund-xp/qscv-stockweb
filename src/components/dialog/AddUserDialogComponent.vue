<template>
  <v-dialog
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    width="500px"
    persistent
  >
    <v-card class="pt-0 pl-5 pr-5" color="#1E1E1E">
      <v-card-title class="text-gold">Agregar {{ getTittle() }}</v-card-title>
      <v-text-field
        v-model="usuario.name"
        class="text-gold"
        label="Nombre"
        prepend-inner-icon="mdi-account"
        required
      />
      <v-text-field
        v-model="usuario.email"
        class="text-gold"
        label="Correo electrónico"
        type="email"
        prepend-inner-icon="mdi-email"
        required
      />
      <v-combobox
        v-if="props.userType === 'V'"
        v-model="selectedItem"
        :items="props.especialidades"
        label="Selecciona un especialidad"
        variant="outlined"
        color="#C5A044"
        :menu-props="{
          contentClass: 'custom-combobox-menu',
          color: '#C5A044',
        }"
      />
      <v-card-actions class="px-5 pb-4">
        <v-btn color="#C5A044" variant="flat" class="text-black" @click.prevent="agregar">
          Agregar
        </v-btn>
        <v-spacer />
        <v-btn variant="outlined" color="#C5A044" @click.prevent="close">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, ref, watch, defineEmits, reactive } from "vue";

const props = defineProps({
  modelValue: Boolean,
  userType: {
    type: String,
    required: true,
  },
  especialidades: { type: [String] },
});

const emit = defineEmits(["update:modelValue", "created"]);

const dialog = ref(false);

const usuario = reactive({
  name: "",
  email: "",
  kind: "P",
});

const selectedItem = ref(null);

watch(
  () => props.modelValue,
  (val) => {
    dialog.value = val;
    if (val) {
      usuario.name = "";
      usuario.email = "";
      usuario.kind = props.userType;
    }
  }
);

watch(dialog, (val) => {
  emit("update:modelValue", val);
});

const close = () => {
  dialog.value = false;
};

const agregar = () => {
  if (!usuario.name || !usuario.email) return;
  emit("created", { ...usuario });
};

const getTittle = () => {
  switch (props.userType) {
    case "V":
      return "Veterinario";
    case "P":
    default:
      return "Propietario";
  }
};
</script>

<style scoped></style>
