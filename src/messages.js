export const welcomeMessage = () => {
  return 'Bienvenido!🎉\n' + 'Este bot te ayudará calcular gastos de gasolina 📝'
}

export const instructionsMessage = () => {
  return (
    'Cada vez cuando echas gasolina, antes de pagar manda el precio q pagas aqui, nada mas.\n\n' +
    'En fin de mes vas a tener mensaje con suma total q pagaste por gasolina en este mes.\n\n' +
    'Abajo te voy a mandar comandos que puedes usar para obtener ayuda o mas informacion'
  )
}

export const helpMessage = () => {
  return (
    '/help - todos los comandos\n\n' +
    '/month - estatistica por este mes\n' +
    '/year - estatistica por este año\n' +
    '/total - estadística por todo el tiempo\n\n' +
    '/delete - borrar monto previamente ingresado'
  )
}

export const adminHelpMessage = () => {
  const basicMessage = helpMessage()

  return (
    basicMessage +
    '\n\n' +
    '/user_fill_tank_on - notify when user fill tank\n' +
    '/user_fill_tank_off - not notify when user fill tank'
  )
}

export const incorrectAmountMessage = () => {
  return '⚠️ Necesitas mandarme número válido'
}

export const successfullyRecordedMessage = () => {
  return '✅ registrado'
}

export const successfullyDeletedMessage = () => {
  return '✅ eliminado'
}

export const successfullyChangedMessage = () => {
  return '✅ cambiado'
}

export const actionNotAllowedMessage = () => {
  return '⛔️ acción no permitida'
}

export const monthStatisticMessage = (data) => {
  return `💰 En este mes gastaste ${data} ₡`
}

export const yearStatisticMessage = (data) => {
  return `💰 En este año gastaste ${data} ₡`
}

export const totalStatisticMessage = (data) => {
  return `💰 En total gastaste ${data} ₡`
}

export const userFilledTankMessage = (username, amount) => {
  return `⛽️ ${username} llenó el tanque por ${amount} ₡`
}
