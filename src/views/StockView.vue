<template>
  <HeaderComponent />
  <v-container class="info-container">
    <v-row class="mb-0">
      <v-col cols="10" md="6" class="d-flex align-center">
        <h1 class="text-h5 text-md-h4 teal-darken-3">Stock</h1>
      </v-col>
      <v-col cols="2" md="6" class="text-end">
        <v-btn
          color="teal-darken-3"
          class="text-grey-lighten-1 d-none d-sm-inline"
          icon="mdi-plus"
          @click="showAgregarStock"
        />
        <v-btn
          color="teal-darken-3"
          class="text-grey-lighten-1 d-inline d-sm-none"
          icon="mdi-plus"
          size="small"
          @click="showAgregarStock"
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
                <th class="font-weight-bold text-uppercase">Bodega</th>
                <th class="font-weight-bold text-uppercase">Cantidad</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stock in filteredStocks" :key="stock.id" class="teal-darken-3">
                <td class="py-3">{{ stock.name }}</td>
                <td class="py-3">{{ stock.vintage }}</td>
                <td class="py-3">{{ stock.bodegaId.name }}</td>
                <td class="py-3">{{ stock.quantity }}</td>
                <td class="py-3" style="text-align: right">
                  <v-btn
                    variant="outlined"
                    icon
                    color="teal-darken-3"
                    size="small"
                    @click="updateDelete(stock)"
                  >
                    <v-icon>mdi-edit</v-icon>
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    icon
                    color="teal-darken-3"
                    size="small"
                    @click="confirmDelete(stock)"
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
    <AgregarStockDialogComponent
      v-model="showDialogAgregarStock"
      :cepas="cepas"
      :bodegas="bodegas"
      @created="agregarStock"
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
      @deleteItem="deleteStock"
    />
  </v-container>
</template>

<script setup>
import { onBeforeMount, ref, computed } from "vue";
import { useRouter } from "vue-router";

import AgregarStockDialogComponent from "@/components/dialog/AgregarStockDialogComponent.vue";
import DeleteConfirmationDialogComponent from "@/components/dialog/DeleteConfirmationDialogComponent.vue";
import AlertComponent from "@/components/AlertComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";

import StockService from "@/services/StockService.js";
import BodegaService from "@/services/BodegaService.js";
import CepaService from "@/services/CepaService.js";
import AuthService from "@/services/AuthService.js";

const router = useRouter();

import { useAuthStore } from "@/stores/auth.js";

const auth = useAuthStore();

const loaded = ref(false);
const stocks = ref([]);
const cepas = ref([]);
const bodegas = ref([]);
const search = ref("");
const showDialogAgregarStock = ref(false);
const deleteDialog = ref(false);
const deleteText = ref("");
const stockToDelete = ref(null);
const alertVisible = ref(false);
const alertText = ref("");
const alertType = ref("warning");
const alertSendLogin = ref(false);

onBeforeMount(() => {
  actualizarInfo();
});

async function actualizarInfo() {
  await refreshAuth();
  await getListStocks();
  await getListBodegas();
  await getListCepas();
  loaded.value = true;
}

const filteredStocks = computed(() => {
  if (!search.value) return stocks.value;
  return stocks.value.filter((stock) =>
    stock.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const confirmDelete = (stock) => {
  stockToDelete.value = stock;
  deleteDialog.value = true;
  deleteText.value = `¿Estás seguro de eliminar a "${stockToDelete?.value.name}"?`;
};

const showAgregarStock = async () => {
  showDialogAgregarStock.value = true;
};

const showAlert = (message) => {
  alertText.value = message;
  alertVisible.value = true;
};

const agregarStock = async (stock) => {
  try {
    await refreshAuth();
    await StockService.create(stock, auth.token);
    await actualizarInfo();
    showDialogAgregarStock.value = false;
  } catch (error) {
    alertText.value =
      "No pudimos agregar la stock. Por favor, inténtalo de nuevo mas tarde.";
    alertVisible.value = true;
  }
};

const deleteStock = async () => {
  try {
    console.log("deleteStock");
    await refreshAuth();
    await StockService.delete(stockToDelete.value._id, auth.token);
    await actualizarInfo();
    deleteDialog.value = false;
  } catch (error) {
    alertText.value =
      "No pudimos eliminar la stock. Por favor, inténtalo de nuevo mas tarde.";
    alertVisible.value = true;
  }
};

const getListStocks = async () => {
  try {
    const response = await StockService.getList(auth.token);
    stocks.value = response.data.stocks;
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
