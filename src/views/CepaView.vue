<template>
  <HeaderComponent />
  <v-container class="info-container">
    <v-row class="mb-0">
      <v-col cols="10" md="6" class="d-flex align-center">
        <h1 class="text-h5 text-md-h4 teal-darken-3">Cepas</h1>
      </v-col>
      <v-col cols="2" md="6" class="text-end">
        <v-btn
          color="teal-darken-3"
          class="text-grey-lighten-1 d-none d-sm-inline"
          icon="mdi-plus"
          @click="showAgregarCepa"
        />
        <v-btn
          color="teal-darken-3"
          class="text-grey-lighten-1 d-inline d-sm-none"
          icon="mdi-plus"
          size="small"
          @click="showAgregarCepa"
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
                <th class="font-weight-bold text-uppercase">Tipo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cepa in filteredCepas" :key="cepa.id" class="teal-darken-3">
                <td class="py-3">{{ cepa.name }}</td>
                <td class="py-3">{{ cepa.type }}</td>
                <td class="py-3" style="text-align: right">
                  <v-btn
                    variant="outlined"
                    icon
                    color="teal-darken-3"
                    size="small"
                    @click="confirmDelete(cepa)"
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
      v-model="showDialogAgregarCepa"
      @created="agregarCepa"
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
      @deleteItem="deleteCepa"
    />
  </v-container>
</template>

<script setup>
import { onBeforeMount, ref, computed } from "vue";
import { useRouter } from "vue-router";

import AgregarCepaDialogComponent from "@/components/dialog/AgregarCepaDialogComponent.vue";
import DeleteConfirmationDialogComponent from "@/components/dialog/DeleteConfirmationDialogComponent.vue";
import AlertComponent from "@/components/AlertComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";

import CepaService from "@/services/CepaService.js";
import AuthService from "@/services/AuthService.js";

const router = useRouter();

import { useAuthStore } from "@/stores/auth.js";

const auth = useAuthStore();

const loaded = ref(false);
const cepas = ref([]);
const search = ref("");
const showDialogAgregarCepa = ref(false);
const deleteDialog = ref(false);
const deleteText = ref("");
const cepaToDelete = ref(null);
const alertVisible = ref(false);
const alertText = ref("");
const alertType = ref("warning");
const alertSendLogin = ref(false);

onBeforeMount(() => {
  actualizarInfo();
});

async function actualizarInfo() {
  await getListCepas();
  loaded.value = true;
}

const filteredCepas = computed(() => {
  if (!search.value) return cepas.value;
  return cepas.value.filter((cepa) =>
    cepa.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const confirmDelete = (cepa) => {
  cepaToDelete.value = cepa;
  deleteDialog.value = true;
  deleteText.value = `¿Estás seguro de eliminar a "${cepaToDelete?.value.name}"?`;
};

const showAgregarCepa = async () => {
  showDialogAgregarCepa.value = true;
};

const showAlert = (message) => {
  alertText.value = message;
  alertVisible.value = true;
};

const agregarCepa = async (cepa) => {
  try {
    await refreshAuth();
    await CepaService.create(cepa, auth.token);
    await actualizarInfo();
    showDialogAgregarCepa.value = false;
  } catch (error) {
    alertText.value =
      "No pudimos agregar la cepa. Por favor, inténtalo de nuevo mas tarde.";
    alertVisible.value = true;
  }
};

const deleteCepa = async () => {
  try {
    await refreshAuth();
    await CepaService.delete(cepaToDelete.value._id, auth.token);
    await actualizarInfo();
    deleteDialog.value = false;
  } catch (error) {
    alertText.value =
      "No pudimos eliminar el herrador. Por favor, inténtalo de nuevo mas tarde.";
    alertVisible.value = true;
  }
};

const getListCepas = async () => {
  try {
    const response = await CepaService.getList(auth.token);
    cepas.value = response.data.cepas;
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

<style scoped>
.teal-darken-3 {
  color: #00695c;
}
</style>
