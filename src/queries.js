import dayjs from 'dayjs'

import db from './db.js'
import { getCurrentCostaRicaTime } from './helpers.js'

export const addQuery = (userId, userName, amount, messageId) => {
  const time = getCurrentCostaRicaTime()

  return new Promise((resolve) => {
    db.query(
      `
      INSERT INTO records (user_id, user_name, amount, message_id, created_at)
      VALUES
      ('${userId}', '${userName}', '${amount}', '${messageId}', '${time}')
    `,
      resolve,
    )
  })
}

export const deleteMutation = (userId) => {
  return new Promise((resolve) => {
    db.query(`DELETE FROM records WHERE user_id = ${userId} ORDER BY id DESC LIMIT 1`, resolve)
  })
}

export const getMonthStatisticQuery = (userId) => {
  return new Promise((resolve) => {
    db.query(`SELECT * FROM records WHERE user_id = '${userId}'`, (err, data) => {
      const result = data.filter(({ created_at }) => {
        return (
          dayjs(created_at).format('YY') === dayjs().format('YY') &&
          dayjs(created_at).format('M') === dayjs().format('M')
        )
      })

      resolve(result)
    })
  })
}

export const getYearStatisticQuery = (userId) => {
  return new Promise((resolve) => {
    db.query(`SELECT * FROM records WHERE user_id = '${userId}'`, (err, data) => {
      const result = data.filter(
        ({ created_at }) => dayjs(created_at).format('YY') === dayjs().format('YY'),
      )

      resolve(result)
    })
  })
}

export const getTotalStatisticQuery = (userId) => {
  return new Promise((resolve) => {
    db.query(`SELECT * FROM records WHERE user_id = '${userId}'`, (err, data) => {
      resolve(data)
    })
  })
}

export const getAllUsersIdsQuery = () => {
  return new Promise((resolve) => {
    db.query(`SELECT user_id FROM records GROUP BY user_id`, (err, data) => {
      resolve(data)
    })
  })
}
