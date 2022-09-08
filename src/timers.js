import dayjs from 'dayjs'

import { getCurrentCostaRicaTime, getTargetDate } from './helpers.js'
import { getAllUsersIdsQuery, getMonthStatisticQuery, getUserNameByIdQuery } from './queries.js'
import { monthStatisticAdminMessage, monthStatisticMessage } from './messages.js'

export const startMonthlyNotificationTimer = (sendMessage, adminsIds) => {
  let targetDate = getTargetDate()

  setInterval(async () => {
    const currentTime = getCurrentCostaRicaTime()

    if (dayjs(currentTime) > targetDate) {
      targetDate = getTargetDate(true)

      const usersIds = await getAllUsersIdsQuery()

      for (const usersIdRecord of usersIds) {
        const sum = await getMonthStatisticQuery(usersIdRecord.user_id)

        sendMessage(usersIdRecord.user_id, monthStatisticMessage(sum))

        if (adminsIds.includes(+usersIdRecord.user_id)) {
          const allUsersIdsData = await getAllUsersIdsQuery()
          const allUsersIdsExceptCurrentUser = allUsersIdsData.filter(
            (el) => +el.user_id !== +usersIdRecord.user_id,
          )
          const monthSumForEachUser = {}

          for (const el of allUsersIdsExceptCurrentUser) {
            const id = el.user_id
            const userName = await getUserNameByIdQuery(id)
            monthSumForEachUser[userName] = await getMonthStatisticQuery(id)
          }

          sendMessage(usersIdRecord.user_id, monthStatisticAdminMessage(monthSumForEachUser), {
            parse_mode: 'HTML',
          })
        }
      }
    }
  }, 1000)
}
