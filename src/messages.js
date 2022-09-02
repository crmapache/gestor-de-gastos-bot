import { addExtraSpacesToTitle, searchTitleMaxLength } from './helpers.js'

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
  return `💰 En este mes gastaste ${data.toLocaleString()} ₡`
}

export const yearStatisticMessage = (totalSum, monthsSumData) => {
  let result = `💰 En este año gastaste ${totalSum.toLocaleString()} ₡\n\n`
  let maxTitleLength = searchTitleMaxLength(monthsSumData)

  for (const key in monthsSumData) {
    const month = key.replace(/[^a-zA-Z]/g, '')

    let titleWithSpaces = addExtraSpacesToTitle(month, maxTitleLength)

    result += `<code>${titleWithSpaces} - ${monthsSumData[key].toLocaleString()} ₡</code>\n`
  }

  return result
}

export const totalStatisticMessage = (totalSum, monthsSumData) => {
  const prepareData = (data) => {
    const dataDividedByYears = Object.entries(data).reduce((acc, cur) => {
      const year = cur[0].replace(/\D/g, '')

      if (acc[year] === undefined) {
        acc[year] = []
      }

      acc[year].push(cur)

      return acc
    }, {})

    return Object.entries(dataDividedByYears)
      .reverse()
      .reduce((acc, cur) => {
        cur[1].forEach((el) => {
          acc[el[0]] = el[1]
        })

        return acc
      }, {})
  }

  const getYearSum = (year, data) => {
    return data.reduce((sum, [title, monthSum]) => {
      const currentYear = title.replace(/\D/g, '')
      if (currentYear === year) {
        return sum + monthSum
      }

      return sum
    }, 0)
  }

  let result = `💰 En total gastaste ${totalSum.toLocaleString()} ₡\n`
  const preparedData = prepareData(monthsSumData)
  const maxTitleLength = searchTitleMaxLength(preparedData)

  Object.entries(preparedData).forEach(([title, monthSum], index, data) => {
    const prevYear = data[index - 1] && data[index - 1][0].replace(/\D/g, '')
    const currentYear = title.replace(/\D/g, '')

    if (prevYear === currentYear) {
      const month = title.replace(/[^a-zA-Z]/g, '')
      const titleWithSpaces = addExtraSpacesToTitle(month, maxTitleLength)

      result += `<code>${titleWithSpaces} - ${monthSum.toLocaleString()} ₡</code>\n`
    } else {
      const yearSum = getYearSum(currentYear, data)
      const titleWithSpaces = addExtraSpacesToTitle(currentYear, maxTitleLength)

      result += `\n\n<code>${titleWithSpaces} - ${yearSum.toLocaleString()} ₡</code>\n\n`
    }
  })

  return result
}

export const userFilledTankMessage = (username, amount) => {
  return `⛽️ ${username} llenó el tanque por ${amount.toLocaleString()} ₡`
}
