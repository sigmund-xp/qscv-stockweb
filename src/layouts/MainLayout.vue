<template>
  <HeaderComponent
    v-if="loaded"
    @showAddOwner="showAddOwner"
    @showAddVeterinarian="showAddVeterinarian"
  />
  <router-view v-if="loaded"></router-view>
  <FooterComponent />
  <AlertComponent
    v-model="dialogVisible"
    :text="dialogText"
    :type="dialogType"
    :sendLogin="dialogSendLogin"
    @update:modelValue="handleAlertClose"
  />
  <AddUserDialogComponent
    v-model="showDialogAddUser"
    :userType="userType"
    :especialidades="param.params.especialidades"
    @created="addUser"
  />
  <LoadingOverlay v-if="!loaded" />
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

import LoadingOverlay from "@/components/LoadingOverlay.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import AlertComponent from "@/components/AlertComponent.vue";
import AddUserDialogComponent from "@/components/dialog/AddUserDialogComponent.vue";

import UserService from "@/services/UserService.js";
import ParamService from "@/services/ParamService.js";

import { useUserInfoStore } from "@/stores/user.js";
import { useAuthStore } from "@/stores/auth.js";
import { useParamsStore } from "@/stores/param.js";

const loaded = ref(false);
const showDialogAddUser = ref(false);
const userType = ref("");
const dialogVisible = ref(false);
const dialogText = ref("");
const dialogSendLogin = ref(false);
const dialogType = ref("warning");

const router = useRouter();
const auth = useAuthStore();
const userInfo = useUserInfoStore();
const param = useParamsStore();

onBeforeMount(() => {
  actualizarInfo();
  loaded.value = true;
});

async function actualizarInfo() {
  await getParams();
  await getUserInfo();
}

const getParams = async () => {
  try {
    const response = await ParamService.getParams(auth.token);
    param.setParams(response.data);
  } catch (error) {
    dialogText.value =
      "Acceso restringido. Esta función no está disponible para tu perfil.";
    dialogVisible.value = true;
  }
};

const getUserInfo = async () => {
  try {
    const response = await UserService.getUserInfo(auth.token);
    userInfo.setUserInfo(response.data.userInfo);
  } catch (error) {
    dialogText.value =
      "Acceso restringido. Esta función no está disponible para tu perfil.";
    dialogVisible.value = true;
  }
};

const handleAlertClose = (sendToLogin) => {
  if (sendToLogin === true) {
    router.push("/login");
  }
};

const addUser = async (user) => {
  try {
    await UserService.createUser(user, auth.token);
    dialogText.value = "Usuario creado.";
    dialogType.value = "info";
    dialogVisible.value = true;
    showDialogAddUser.value = false;
  } catch (error) {
    dialogText.value = error.response.data.error;
    dialogType.value = "warning";
    dialogVisible.value = true;
  }
};

const showAddOwner = (value) => {
  userType.value = "P";
  showDialogAddUser.value = value;
};

const showAddVeterinarian = (value) => {
  userType.value = "V";
  showDialogAddUser.value = value;
};
</script>
