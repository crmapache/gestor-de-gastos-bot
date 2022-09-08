import dayjs from 'dayjs'

import { getCurrentCostaRicaTime } from './helpers.js'
import { getAllUsersIdsQuery, getMonthStatisticQuery } from './queries.js'
import { monthStatisticMessage } from './messages.js'

export const startMonthlyNotificationTimer = (sendMessage) => {
  const firstDayInMonth = dayjs().format('YYYY-MM-01')
  let targetDate = dayjs(firstDayInMonth).add(1, 'month')

  setInterval(async () => {
    const currentTime = getCurrentCostaRicaTime()

    if (dayjs(currentTime) > targetDate) {
      const firstDayInMonth = dayjs().format('YYYY-MM-01')
      targetDate = dayjs(firstDayInMonth).add(1, 'month')

      const usersIds = await getAllUsersIdsQuery()

      for (const el of usersIds) {
        const userId = el.user_id
        const statisticData = await getMonthStatisticQuery(userId)
        const sum = calculateSum(statisticData)

        sendMessage(userId, monthStatisticMessage(sum))
      }
    }
  }, 1000)
}
