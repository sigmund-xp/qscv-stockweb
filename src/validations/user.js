const validateEmail = (email) => {
  if (!email) return false
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(email)) {
    return false
  }
  return true
}

const validarArea = (area) => {
  if (!area) return false
  const regex = /^\d{2,4}$/
  return regex.test(area)
}

const validarNumero = (numero) => {
  if (!numero) return false
  const regex = /^\d{6,8}$/
  return regex.test(numero)
}

const validarPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
  if (!password) return false
  if (!regex.test(password)) {
    return false
  }
  return true
}

export const userDataValidation = (usuario) => {
  let msg = ""
  if (usuario.name === '') {
    msg = "El nombre no puede estar vacio"
  } else if (!validateEmail(usuario.email)) {
    msg = "El formato del email es incorrecto"
  } else if (!validarArea(usuario.phoneArea)) {
    msg = "El área debe tener entre 2 y 4 dígitos"
  } else if (!validarNumero(usuario.phoneNumber)) {
    msg = "El número de teléfono debe tener entre 6 y 8 dígitos"
  }
  return msg
}

export const userValidation = (usuario) => {
  let msg = userDataValidation(usuario)
  if (msg === '') {
    if (!validarPassword(usuario.password)) {
      msg = "La contraseña debe tener al menos una mayúscula, una minúscula, un número y como mínimo 6 caracteres"
    } else if (usuario.password != usuario.confirmPassword) {
      msg = "Las contraseñas no coinciden"
    }
  }
  return msg
}