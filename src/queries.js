import db from './db.js'
import {
  getCurrentCostaRicaTime,
  prepareMonthStatisticMessage,
  prepareTotalStatisticMessage,
  prepareYearStatisticMessage,
} from './helpers.js'
import dayjs from 'dayjs'

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
      const result = data.filter((el) => {
        return (
          dayjs(el.created_at).format('YY') === dayjs().format('YY') &&
          dayjs(el.created_at).format('M') === dayjs().format('M')
        )
      })

      const message = prepareMonthStatisticMessage(result)

      resolve(message)
    })
  })
}

export const getYearStatisticQuery = (userId) => {
  return new Promise((resolve) => {
    db.query(`SELECT * FROM records WHERE user_id = '${userId}'`, (err, data) => {
      const result = data.filter((el) => dayjs(el.created_at).format('YY') === dayjs().format('YY'))

      const message = prepareYearStatisticMessage(result)

      resolve(message)
    })
  })
}

export const getTotalStatisticQuery = (userId) => {
  return new Promise((resolve) => {
    db.query(`SELECT * FROM records WHERE user_id = '${userId}'`, (err, data) => {
      const message = prepareTotalStatisticMessage(data)

      resolve(message)
    })
  })
}
