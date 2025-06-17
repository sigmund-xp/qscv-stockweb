<template>
  <v-container class="info-container">
    <v-row class="mb-0">
      <v-col cols="10" md="6" class="d-flex align-center">
        <h1 class="text-h5 text-md-h4 text-gold">Herradores</h1>
      </v-col>
      <v-col cols="2" md="6" class="text-end">
        <v-btn
          color="#C5A044"
          class="text-black d-none d-sm-inline"
          icon="mdi-plus"
          @click="showAddFarrier"
        />
        <v-btn
          color="#C5A044"
          class="text-black d-inline d-sm-none"
          icon="mdi-plus"
          size="small"
          @click="showAddFarrier"
        />
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col cols="12" class="pt-0 pb-0">
        <v-text-field
          v-model="search"
          hide-details="auto"
          label="Filtrar por nombre"
          prepend-inner-icon="mdi-filter"
          variant="outlined"
          clearable
        />
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col cols="12">
        <v-card>
          <v-table theme="dark" class="bg-#111111" density="comfortable">
            <thead>
              <tr>
                <th class="text-gold font-weight-bold text-uppercase">Nombre</th>
                <th
                  class="text-gold font-weight-bold text-uppercase d-none d-sm-table-cell"
                >
                  Email
                </th>
                <th class="text-gold font-weight-bold text-uppercase">Tipo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="farrier in filteredFarriers" :key="farrier.id" class="text-gold">
                <td class="py-3">{{ farrier.name }}</td>
                <td class="py-3 d-none d-sm-table-cell">{{ farrier.email }}</td>
                <td class="py-3">{{ formatPhone(farrier) }}</td>
                <td class="py-3" style="text-align: right">
                  <v-btn
                    variant="outlined"
                    icon
                    color="#C5A044"
                    size="small"
                    @click="confirmDelete(farrier)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
    <AgregarCepaDialogComponent
      v-model="showDialogAddFarrier"
      @created="addFarrier"
      @alert="showAlert"
    />
    <AlertComponent
      v-model="alertVisible"
      :text="alertText"
      :type="alertType"
      :sendLogin="alertSendLogin"
      @update:modelValue="handleAlertClose"
    />
    <DeleteConfirmationDialogComponent
      v-model="deleteDialog"
      :text="deleteText"
      @deleteItem="deleteFarrier"
    />
  </v-container>
</template>

<script setup>
import { onBeforeMount, ref, computed } from "vue";
import { useRouter } from "vue-router";

import AgregarCepaDialogComponent from "@/components/dialog/AgregarCepaDialogComponent.vue";
import DeleteConfirmationDialogComponent from "@/components/dialog/DeleteConfirmationDialogComponent.vue";
import AlertComponent from "@/components/AlertComponent.vue";

import FarrierService from "@/services/CepaService.js";
import AuthService from "@/services/AuthService.js";

const router = useRouter();

import { useAuthStore } from "@/stores/auth.js";

const auth = useAuthStore();

const loaded = ref(false);
const farriers = ref([]);
const search = ref("");
const showDialogAddFarrier = ref(false);
const deleteDialog = ref(false);
const deleteText = ref("");
const farrierToDelete = ref(null);
const alertVisible = ref(false);
const alertText = ref("");
const alertType = ref("warning");
const alertSendLogin = ref(false);

onBeforeMount(() => {
  actualizarInfo();
});

async function actualizarInfo() {
  await getListFarriers();
  loaded.value = true;
}

const filteredFarriers = computed(() => {
  if (!search.value) return farriers.value;
  return farriers.value.filter((farrier) =>
    farrier.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const formatPhone = (farrier) => {
  return `+54 (${farrier.phoneArea}) ${formatNumber(farrier.phoneNumber)}`;
};

const formatNumber = (numero) => {
  const largo = numero.length;

  if (largo > 4) {
    return `${numero.slice(0, largo - 4)}-${numero.slice(largo - 4)}`;
  }
  return numero;
};

const confirmDelete = (farrier) => {
  farrierToDelete.value = farrier;
  deleteDialog.value = true;
  deleteText.value = `¿Estás seguro de eliminar a "${farrierToDelete?.value.name}"?`;
};

const showAddFarrier = async () => {
  showDialogAddFarrier.value = true;
};

const showAlert = (message) => {
  alertText.value = message;
  alertVisible.value = true;
};

const addFarrier = async (farrier) => {
  try {
    await refreshAuth();
    await FarrierService.createFarrier(farrier, auth.token);
    await actualizarInfo();
    showDialogAddFarrier.value = false;
  } catch (error) {
    alertText.value =
      "No pudimos agregar el herrador. Por favor, inténtalo de nuevo mas tarde.";
    alertVisible.value = true;
  }
};

const deleteFarrier = async () => {
  try {
    await refreshAuth();
    await FarrierService.deleteFarrier(farrierToDelete.value._id, auth.token);
    await actualizarInfo();
    deleteDialog.value = false;
  } catch (error) {
    alertText.value =
      "No pudimos eliminar el herrador. Por favor, inténtalo de nuevo mas tarde.";
    alertVisible.value = true;
  }
};

const getListFarriers = async () => {
  try {
    const response = await FarrierService.getListFarriers(auth.token);
    farriers.value = response.data.farriers;
  } catch (error) {
    alertText.value =
      "No pudimos cargar los herradores. Por favor, inténtalo de nuevo más tarde.";
    alertVisible.value = true;
  }
};

const refreshAuth = async () => {
  try {
    const response = await AuthService.refreshToken();
    auth.setToken(response.data.token);
  } catch (error) {
    console.log(error);
    alertText.value =
      "Acceso restringido. Esta función no está disponible para tu perfil.";
    alertVisible.value = true;
    alertType.value = "warning";
    alertSendLogin.value = true;
  }
};

const handleAlertClose = (newValue, sendToLogin) => {
  if (sendToLogin) {
    router.push("/login");
  }
  alertVisible.value = newValue;
};
</script>

<style scoped></style>
