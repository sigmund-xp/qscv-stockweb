<template>
  <HeaderComponent />
  <v-container class="info-container">
    <v-row class="mb-0">
      <v-col cols="10" md="6" class="d-flex align-center">
        <h1 class="text-h5 text-md-h4 teal-darken-3">Bodegas</h1>
      </v-col>
      <v-col cols="2" md="6" class="text-end">
        <v-btn
          color="teal-darken-3"
          class="text-grey-lighten-1 d-none d-sm-inline"
          icon="mdi-plus"
          @click="showAgregarBodega"
        />
        <v-btn
          color="teal-darken-3"
          class="text-grey-lighten-1 d-inline d-sm-none"
          icon="mdi-plus"
          size="small"
          @click="showAgregarBodega"
        />
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col cols="12" class="pt-0 pb-2">
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
          <v-table class="teal-darken-3" density="comfortable">
            <thead>
              <tr>
                <th class="font-weight-bold text-uppercase">Nombre</th>
                <th class="font-weight-bold text-uppercase">Provincia</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="bodega in filteredBodegas"
                :key="bodega.id"
                class="teal-darken-3"
              >
                <td class="py-3">{{ bodega.name }}</td>
                <td class="py-3">{{ bodega.province }}</td>
                <td class="py-3" style="text-align: right">
                  <v-btn
                    variant="outlined"
                    icon
                    color="teal-darken-3"
                    size="small"
                    @click="confirmDelete(bodega)"
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
    <AgregarBodegaDialogComponent
      v-model="showDialogAgregarBodega"
      @created="agregarBodega"
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
      @deleteItem="deleteBodega"
    />
  </v-container>
</template>

<script setup>
import { onBeforeMount, ref, computed } from "vue";
import { useRouter } from "vue-router";

import AgregarBodegaDialogComponent from "@/components/dialog/AgregarBodegaDialogComponent.vue";
import DeleteConfirmationDialogComponent from "@/components/dialog/DeleteConfirmationDialogComponent.vue";
import AlertComponent from "@/components/AlertComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";

import BodegaService from "@/services/BodegaService.js";
import AuthService from "@/services/AuthService.js";

const router = useRouter();

import { useAuthStore } from "@/stores/auth.js";

const auth = useAuthStore();

const loaded = ref(false);
const bodegas = ref([]);
const search = ref("");
const showDialogAgregarBodega = ref(false);
const deleteDialog = ref(false);
const deleteText = ref("");
const bodegaToDelete = ref(null);
const alertVisible = ref(false);
const alertText = ref("");
const alertType = ref("warning");
const alertSendLogin = ref(false);

onBeforeMount(() => {
  actualizarInfo();
});

async function actualizarInfo() {
  await getListBodegas();
  loaded.value = true;
}

const filteredBodegas = computed(() => {
  if (!search.value) return bodegas.value;
  return bodegas.value.filter((bodega) =>
    bodega.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const confirmDelete = (bodega) => {
  bodegaToDelete.value = bodega;
  deleteDialog.value = true;
  deleteText.value = `¿Estás seguro de eliminar a "${bodegaToDelete?.value.name}"?`;
};

const showAgregarBodega = async () => {
  showDialogAgregarBodega.value = true;
};

const showAlert = (message) => {
  alertText.value = message;
  alertVisible.value = true;
};

const agregarBodega = async (bodega) => {
  try {
    await refreshAuth();
    await BodegaService.create(bodega, auth.token);
    await actualizarInfo();
    showDialogAgregarBodega.value = false;
  } catch (error) {
    alertText.value =
      "No pudimos agregar la bodega. Por favor, inténtalo de nuevo mas tarde.";
    alertVisible.value = true;
  }
};

const deleteBodega = async () => {
  try {
    console.log("deleteBodega");
    await refreshAuth();
    await BodegaService.delete(bodegaToDelete.value._id, auth.token);
    await actualizarInfo();
    deleteDialog.value = false;
  } catch (error) {
    alertText.value =
      "No pudimos eliminar la bodega. Por favor, inténtalo de nuevo mas tarde.";
    alertVisible.value = true;
  }
};

const getListBodegas = async () => {
  try {
    const response = await BodegaService.getList(auth.token);
    bodegas.value = response.data.bodegas;
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
    router.push("/");
  }
  alertVisible.value = newValue;
};
</script>

<style scoped>
.teal-darken-3 {
  color: #00695c;
}
</style>
