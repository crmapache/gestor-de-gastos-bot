import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

export const getCurrentCostaRicaTime = () => {
  return dayjs().tz('America/Costa_Rica').format('YYYY[-]MM[-]DD HH[:]mm[:]ss')
}

export const prepareMonthStatisticMessage = (data) => {
  const amount = data.reduce((sum, el) => sum + +el.amount, 0)
  return `💰 En este mes gastaste ${amount.toLocaleString()} ₡`
}

export const prepareYearStatisticMessage = (data) => {
  const amount = data.reduce((sum, el) => sum + +el.amount, 0)
  return `💰 En este año gastaste ${amount.toLocaleString()} ₡`
}

export const prepareTotalStatisticMessage = (data) => {
  const amount = data.reduce((sum, el) => sum + +el.amount, 0)
  return `💰 En total gastaste ${amount.toLocaleString()} ₡`
}
