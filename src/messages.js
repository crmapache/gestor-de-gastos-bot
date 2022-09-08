import { addExtraSpacesToTitle, getTitleMaxLength, searchTitleMaxLength } from './helpers.js'
import dayjs from 'dayjs'

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
    '/list - obtener los datos más recientes\n' +
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

export const listStatisticTitleMessage = () => {
  return '📜 Aquí está tu lista de gastos recientes'
}

export const monthStatisticMessage = (sum) => {
  return `💰 En este mes gastaste ${sum.toLocaleString()} ₡`
}

export const monthStatisticAdminMessage = (data) => {
  const maxTitleLength = getTitleMaxLength(data)
  let result = ''

  for (const userName in data) {
    const sum = data[userName]
    const titleWithSpaces = addExtraSpacesToTitle(userName, maxTitleLength)

    result += `<code>${titleWithSpaces} - ${sum.toLocaleString()} ₡</code>\n`
  }

  return result
}

export const yearStatisticMessage = (sum) => {
  return `💰 En este año gastaste ${sum.toLocaleString()} ₡`
}

export const yearExtendedStatisticMessage = (data) => {
  const preparedData = data.reduce((acc, cur) => ({ ...acc, [cur.month]: cur.sum }), {})
  const preparedDataForGetMaxTitleLength = {}
  let result = ''

  for (let i = 1; i <= 12; i++) {
    let label = dayjs(`2000-${i}-01`).format('MMMM')
    label = `${label[0].toUpperCase()}${label.slice(1)}`

    preparedDataForGetMaxTitleLength[label] = preparedData[i] || 0
  }

  const maxTitleLength = getTitleMaxLength(preparedDataForGetMaxTitleLength)

  for (const month in preparedDataForGetMaxTitleLength) {
    const sum = preparedDataForGetMaxTitleLength[month]
    const titleWithSpaces = addExtraSpacesToTitle(month, maxTitleLength)

    result += `<code>${titleWithSpaces} - ${sum.toLocaleString()} ₡</code>\n`
  }

  return result
}

export const totalStatisticMessage = (sum) => {
  return `💰 En total gastaste ${sum.toLocaleString()} ₡`
}

export const totalExtendedStatisticMessage = (data) => {
  let result = ''

  for (const el of data) {
    result += `<code>${el.sum.toLocaleString()} ₡ - ${el.year}</code>\n`
  }

  return result
}

export const userFilledTankMessage = (username, amount) => {
  return `⛽️ ${username} llenó el tanque por ${amount.toLocaleString()} ₡`
}

export const listStatisticMessage = (data) => {
  let result = ''

  const preparedData = data.reduce(
    (acc, cur) => ({ ...acc, [`${cur.amount.toLocaleString()} ₡`]: '' }),
    {},
  )

  const maxTitleLength = getTitleMaxLength(preparedData)

  data.forEach(({ amount, created_at }) => {
    const date = dayjs(created_at).format('DD.MM.YYYY')
    const titleWithSpaces = addExtraSpacesToTitle(`${amount.toLocaleString()} ₡`, maxTitleLength)

    result += `<code>${titleWithSpaces} - ${date}</code>\n`
  })

  return result
}
