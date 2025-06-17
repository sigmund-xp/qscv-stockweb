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

export const farrierDataValidation = (farrier) => {
  let msg = ""
  if (farrier.name === '') {
    msg = "El nombre no puede estar vacio"
  } else if (!validateEmail(farrier.email)) {
    msg = "El formato del email es incorrecto"
  } else if (!validarArea(farrier.phoneArea)) {
    msg = "El área debe tener entre 2 y 4 dígitos"
  } else if (!validarNumero(farrier.phoneNumber)) {
    msg = "El número de teléfono debe tener entre 6 y 8 dígitos"
  }
  return msg
}