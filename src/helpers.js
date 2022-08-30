import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

export const getCurrentCostaRicaTime = () => {
  return dayjs().tz('America/Costa_Rica').format('YYYY[-]MM[-]DD HH[:]mm[:]ss')
}

export const createSendMessage = (fn) => {
  return (userId, message) => {
    return new Promise((resolve) => {
      fn(userId, message)
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
