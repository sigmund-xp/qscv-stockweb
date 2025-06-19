<template>
  <HeaderComponent />
  <v-container class="info-container">
    <v-row class="mb-0">
      <v-col cols="10" md="6" class="d-flex align-center">
        <h1 class="text-h5 text-md-h4 teal-darken-3">Etiquetas</h1>
      </v-col>
      <v-col cols="2" md="6" class="text-end">
        <v-btn
          color="teal-darken-3"
          class="text-grey-lighten-1 d-none d-sm-inline"
          icon="mdi-plus"
          @click="showAgregarEtiqueta"
        />
        <v-btn
          color="teal-darken-3"
          class="text-grey-lighten-1 d-inline d-sm-none"
          icon="mdi-plus"
          size="small"
          @click="showAgregarEtiqueta"
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
                <th class="font-weight-bold text-uppercase">Añada</th>
                <th class="font-weight-bold text-uppercase">Tipo</th>
                <th class="font-weight-bold text-uppercase">Bodega</th>
                <th class="font-weight-bold text-uppercase">Composición</th>
                <th class="font-weight-bold text-uppercase">Cantidad</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="etiqueta in filteredEtiquetas"
                :key="etiqueta.id"
                class="teal-darken-3"
              >
                <td class="py-3">{{ etiqueta.name }}</td>
                <td class="py-3">{{ etiqueta.vintage }}</td>
                <td class="py-3">{{ etiqueta.type }}</td>
                <td class="py-3">{{ etiqueta.bodegaId.name }}</td>
                <td class="py-3">{{ etiqueta.cepas.join(", ") }}</td>
                <td class="py-3">{{ etiqueta.quantity }}</td>
                <td class="py-3" style="text-align: left">
                  <v-btn
                    variant="outlined"
                    icon
                    color="teal-darken-3"
                    size="small"
                    class="mr-2"
                    @click="modificar(etiqueta)"
                  >
                    <v-icon>mdi-swap-vertical-bold</v-icon>
                  </v-btn>
                </td>
                <td class="py-3" style="text-align: right">
                  <v-btn
                    variant="outlined"
                    icon
                    color="teal-darken-3"
                    size="small"
                    @click="confirmDelete(etiqueta)"
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
    <AgregarEtiquetaDialogComponent
      v-model="showDialogAgregarEtiqueta"
      :cepas="cepas"
      :bodegas="bodegas"
      @created="agregarEtiqueta"
      @alert="showAlert"
    />
    <ModificarEtiquetaDialogComponent
      v-model="showDialogModificarEtiqueta"
      :id="cepas"
      :bodegas="bodegas"
      @created="modificarEtiqueta"
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
      @deleteItem="deleteEtiqueta"
    />
  </v-container>
</template>

<script setup>
import { onBeforeMount, ref, computed } from "vue";
import { useRouter } from "vue-router";

import AgregarEtiquetaDialogComponent from "@/components/dialog/AgregarEtiquetaDialogComponent.vue";
import DeleteConfirmationDialogComponent from "@/components/dialog/DeleteConfirmationDialogComponent.vue";
import AlertComponent from "@/components/AlertComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";

import EtiquetaService from "@/services/EtiquetaService.js";
import BodegaService from "@/services/BodegaService.js";
import CepaService from "@/services/CepaService.js";
import AuthService from "@/services/AuthService.js";

const router = useRouter();

import { useAuthStore } from "@/stores/auth.js";

const auth = useAuthStore();

const loaded = ref(false);
const etiquetas = ref([]);
const cepas = ref([]);
const bodegas = ref([]);
const search = ref("");
const showDialogAgregarEtiqueta = ref(false);
const deleteDialog = ref(false);
const deleteText = ref("");
const etiquetaToDelete = ref(null);
const alertVisible = ref(false);
const alertText = ref("");
const alertType = ref("warning");
const alertSendLogin = ref(false);

onBeforeMount(() => {
  actualizarInfo();
});

async function actualizarInfo() {
  await refreshAuth();
  await getListEtiquetas();
  await getListBodegas();
  await getListCepas();
  loaded.value = true;
}

const filteredEtiquetas = computed(() => {
  if (!search.value) return etiquetas.value;
  return etiquetas.value.filter((etiqueta) =>
    etiqueta.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const modificar = (etiqueta) => {
  etiquetaToDelete.value = etiqueta;
  deleteDialog.value = true;
  deleteText.value = `¿Estás seguro de eliminar a "${etiquetaToDelete?.value.name}"?`;
};

const confirmDelete = (etiqueta) => {
  etiquetaToDelete.value = etiqueta;
  deleteDialog.value = true;
  deleteText.value = `¿Estás seguro de eliminar a "${etiquetaToDelete?.value.name}"?`;
};

const showAgregarEtiqueta = async () => {
  showDialogAgregarEtiqueta.value = true;
};

const showAlert = (message) => {
  alertText.value = message;
  alertVisible.value = true;
};

const agregarEtiqueta = async (etiqueta) => {
  try {
    await refreshAuth();
    await EtiquetaService.create(etiqueta, auth.token);
    await actualizarInfo();
    showDialogAgregarEtiqueta.value = false;
  } catch (error) {
    alertText.value =
      "No pudimos agregar la etiqueta. Por favor, inténtalo de nuevo mas tarde.";
    alertVisible.value = true;
  }
};

const deleteEtiqueta = async () => {
  try {
    console.log("deleteEtiqueta");
    await refreshAuth();
    await EtiquetaService.delete(etiquetaToDelete.value._id, auth.token);
    await actualizarInfo();
    deleteDialog.value = false;
  } catch (error) {
    alertText.value =
      "No pudimos eliminar la etiqueta. Por favor, inténtalo de nuevo mas tarde.";
    alertVisible.value = true;
  }
};

const getListEtiquetas = async () => {
  try {
    const response = await EtiquetaService.getList(auth.token);
    etiquetas.value = response.data.etiquetas;
  } catch (error) {
    alertText.value =
      "No pudimos cargar las etiqietas. Por favor, inténtalo de nuevo más tarde.";
    alertVisible.value = true;
  }
};

const getListBodegas = async () => {
  try {
    const response = await BodegaService.getListCombo(auth.token);
    console.log(JSON.stringify(response.data.bodegas));
    bodegas.value = response.data.bodegas;
  } catch (error) {
    alertText.value =
      "No pudimos cargar las bodegas. Por favor, inténtalo de nuevo más tarde.";
    alertVisible.value = true;
  }
};

const getListCepas = async () => {
  try {
    const response = await CepaService.getListCombo(auth.token);
    console.log(JSON.stringify(response.data.cepas));
    cepas.value = response.data.cepas;
  } catch (error) {
    alertText.value =
      "No pudimos cargar las cepas. Por favor, inténtalo de nuevo más tarde.";
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
