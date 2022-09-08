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

export const addExtraSpacesToTitle = (title, maxTitleLength) => {
  return [...new Array(maxTitleLength - title.length)].reduce((acc, __) => acc + ' ', title)
}

export const getTitleMaxLength = (data) => {
  let maxKeyChars = 0

  for (const key in data) {
    if (key.length > maxKeyChars) {
      maxKeyChars = key.length
    }
  }

  return maxKeyChars
}

export const getTargetDate = (isForNextMonth) => {
  const firstDayInNextMonth = dayjs().format(
    `YYYY-${+dayjs().format('M') + (isForNextMonth ? 2 : 1)}-01`,
  )
  return dayjs(firstDayInNextMonth).add(-1, 'minute')
}
