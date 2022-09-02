import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import es from 'dayjs/locale/es.js'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('es')

export const getCurrentCostaRicaTime = () => {
  return dayjs().tz('America/Costa_Rica').format('YYYY[-]MM[-]DD HH[:]mm[:]ss')
}

export const createSendMessage = (fn) => {
  return (userId, message, options = {}) => {
    return new Promise((resolve) => {
      fn(userId, message, options)
        .then(() => {
          resolve()
        })
        .catch(() => {})
    })
  }
}

export const calculateSum = (data, fieldKey = 'amount') => {
  return data.reduce((sum, el) => sum + +el[fieldKey], 0)
}

export const calculateMonthsSum = (data) => {
  const result = {}

  data.forEach(({ created_at, amount }) => {
    const date = dayjs(created_at).format('MMMM YYYY')
    const dateUppercasedName = `${date[0].toUpperCase()}${date.slice(1)}`

    if (result[dateUppercasedName] === undefined) {
      result[dateUppercasedName] = 0
    }

    result[dateUppercasedName] += amount
  })

  return result
}

export const addExtraSpacesToTitle = (title, maxTitleLength) => {
  return [...new Array(maxTitleLength - title.length)].reduce((acc, __) => acc + ' ', title)
}

export const searchTitleMaxLength = (data) => {
  let maxKeyChars = 0

  for (const key in data) {
    const month = key.replace(/[^a-zA-Z]/g, '')

    if (month.length > maxKeyChars) {
      maxKeyChars = month.length
    }
  }

  return maxKeyChars
}
