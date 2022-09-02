import dayjs from 'dayjs'

import db from './db.js'
import { getCurrentCostaRicaTime } from './helpers.js'

export const addFakeDataQuery = () => {
  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  function add(id, name, amount, time) {
    return new Promise((resolve) => {
      db.query(
        `
      INSERT INTO records (user_id, user_name, amount, created_at)
      VALUES
      ('${id}', '${name}', '${amount}', '${time}')
    `,
        resolve,
      )
    })
  }

  const users = [
    { id: '437777592', name: 'Max' },
    { id: '1494567197 ', name: 'Mauricio' },
    { id: '425001403', name: 'Nikolay' },
  ]

  const process = async (user) => {
    for (let i = 40; i >= 0; i--) {
      const dateTime = dayjs().add(-i, 'month')
      const daysInMonth = dateTime.daysInMonth()

      for (let j = 1; j <= daysInMonth; j++) {
        if (getRndInteger(1, 3) === 1) {
          const preparedDate = dateTime
            .set('date', j)
            .set('hour', getRndInteger(0, 24))
            .set('minute', getRndInteger(0, 60))
            .set('second', getRndInteger(0, 60))
            .format('YYYY-MM-DD HH:mm:ss')
          const amount = getRndInteger(5000, 52001)
          await add(user.id, user.name, amount, preparedDate)
        }
      }
    }
  }

  users.forEach((user) => {
    process(user)
  })
}

export const addQuery = (userId, userName, amount) => {
  const time = getCurrentCostaRicaTime()

  return new Promise((resolve) => {
    db.query(
      `
      INSERT INTO records (user_id, user_name, amount, created_at)
      VALUES
      ('${userId}', '${userName}', '${amount}', '${time}')
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
