<template>
  <v-container class="info-container">
    <template v-if="validToken === null">
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate color="primary" />
        </v-col>
      </v-row>
    </template>
    <v-row justify="center" v-else-if="validToken">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo-lm.png')"
          alt="Logo Las Marías"
          :width="$vuetify.display.smAndDown ? '50%' : '25%'"
          class="mb-4 mx-auto"
        />
        <v-form @submit.prevent="register" class="w-100" max-width="400">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="usuario.name"
                class="text-gold"
                label="Nombre"
                prepend-inner-icon="mdi-account"
                required
                readonly
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="usuario.email"
                class="text-gold"
                label="Correo electrónico"
                type="email"
                prepend-inner-icon="mdi-email"
                required
                readonly
              />
            </v-col>
            <v-col cols="12" class="mt-0 pt-0 pb-0 mb-0">
              <div class="text-gold label-opacity text-body-1">Teléfono</div>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="usuario.phoneArea"
                ref="area"
                class="text-gold"
                label="Área"
                maxlength="4"
                prepend-inner-icon="mdi-map-marker"
                type="tel"
                @input="usuario.phoneArea = soloNumeros(usuario.phoneArea)"
                required
              />
            </v-col>
            <v-col cols="8">
              <v-text-field
                v-model="usuario.phoneNumber"
                class="text-gold"
                label="Número"
                maxlength="8"
                prepend-inner-icon="mdi-phone"
                type="tel"
                @input="usuario.phoneNumber = soloNumeros(usuario.phoneNumber)"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="usuario.password"
                class="text-gold"
                label="Contraseña"
                prepend-inner-icon="mdi-lock"
                type="password"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="usuario.confirmPassword"
                class="text-gold"
                label="Confirmar contraseña"
                prepend-inner-icon="mdi-lock-check"
                type="password"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-btn
                class="text-black mb-3 d-block mx-auto"
                color="#C5A044"
                @click.prevent="register"
              >
                Registrarse
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    <v-row justify="center" v-else>
      <v-col cols="12" md="6">
        <v-img
          :src="require('../assets/logo-lm.png')"
          alt="Logo Las Marías"
          :width="$vuetify.display.smAndDown ? '75%' : '50%'"
          class="mb-4 mx-auto"
        />
        <h2 class="text-gold text-center mb-2">Usuario no encontrado</h2>
        <p class="text-gold text-center mb-6">
          No pudimos verificar al usuario. Es posible que el enlace haya expirado o sea
          incorrecto.
        </p>
        <v-btn
          class="text-black mb-3 d-block mx-auto"
          color="#C5A044"
          @click.prevent="volver"
          >Volver</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="dialog" width="300px">
    <v-card class="pa-0">
      <v-alert class="py-6 pr-8" :text="text" :type="type"></v-alert>
      <v-btn
        icon
        size="x-small"
        color="#B00020"
        variant="plain"
        class="close-btn"
        @click="dialog = false"
      >
        <v-icon class="text-white">mdi-close</v-icon>
      </v-btn>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { onMounted, nextTick, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import AuthService from "../services/AuthService.js";
import UserService from "../services/UserService.js";
import { userValidation } from "../validations/user.js";

const dialog = ref(false);
const text = ref("");
const type = ref("warning");
const area = ref(null);
const validToken = ref(null);

const router = useRouter();
const route = useRoute();

const token = route.params.token;

const usuario = reactive({
  uid: "",
  name: "",
  email: "",
  phoneArea: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
});

onMounted(async () => {
  validToken.value = await isValidToken(token);
  await nextTick();
  if (area.value) {
    area.value.focus();
  }
});

const isValidToken = async (token) => {
  try {
    const response = await AuthService.verify(token);
    usuario.name = response.data.name;
    usuario.email = response.data.email;
    return true;
  } catch (error) {
    console.log("Error de red u otro: ", error.message);
    return false;
  }
};

onMounted(async () => {
  validToken.value = await isValidToken(token);
  await nextTick();
  if (area.value) {
    area.value.focus();
  }
});

const formatPhone = (numero) => {
  const largo = numero.length;

  if (largo > 4) {
    return `${numero.slice(0, largo - 4)}-${numero.slice(largo - 4)}`;
  }
  return numero;
};

const soloNumeros = (valor) => {
  return valor.replace(/\D/g, "");
};

const volver = async () => {
  router.push("/login");
};

const register = () => {
  const message = userValidation(usuario);
  if (message) {
    text.value = message;
    dialog.value = true;
  } else {
    UserService.register(
      {
        phoneArea: usuario.phoneArea,
        phoneNumber: formatPhone(usuario.phoneNumber),
        password: usuario.password,
      },
      token
    )
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {
        if (error.response) {
          console.log(
            "Mensaje del servidor:",
            JSON.stringify(error.response.data.errors[0].msg)
          );
        } else {
          console.log("Error de red u otro:", error.message);
        }
      });
  }
};
</script>
<style scoped>
.info-container {
  margin-top: 1rem;
}
.label-opacity {
  opacity: 0.6 !important;
}
.close-btn {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 10;
}
</style>
