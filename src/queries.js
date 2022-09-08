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
    { id: '1494567197', name: 'Mauricio' },
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
    db.query(
      `SELECT COALESCE(SUM(amount), 0) as sum FROM records WHERE
        user_id = '${userId}'
        AND MONTH(created_at) = MONTH(now()) - 1
        AND YEAR(created_at) = YEAR(now())`,
      (err, data) => resolve(data[0]?.sum || 0),
    )
  })
}

export const getYearStatisticQuery = (userId) => {
  return new Promise((resolve) => {
    db.query(
      `SELECT COALESCE(SUM(amount), 0) as sum FROM records WHERE
        user_id = '${userId}'
        AND YEAR(created_at) = YEAR(now())`,
      (err, data) => resolve(data[0]?.sum || 0),
    )
  })
}

export const getYearExtendedStatisticQuery = (userId) => {
  return new Promise((resolve) => {
    db.query(
      `SELECT COALESCE(SUM(amount), 0) as sum, MONTH(created_at) as month FROM records WHERE
        user_id = '${userId}'
        AND YEAR(created_at) = YEAR(now()) GROUP BY MONTH(created_at)`,
      (err, data) => resolve(data),
    )
  })
}

export const getTotalStatisticQuery = (userId) => {
  return new Promise((resolve) => {
    db.query(
      `SELECT COALESCE(SUM(amount), 0) as sum FROM records WHERE user_id = '${userId}'`,
      (err, data) => resolve(data[0]?.sum || 0),
    )
  })
}

export const getTotalExtendedStatisticQuery = (userId) => {
  return new Promise((resolve) => {
    db.query(
      `SELECT COALESCE(SUM(amount), 0) as sum, YEAR(created_at) as year FROM records WHERE
        user_id = '${userId}'
        GROUP BY YEAR(created_at) ORDER BY YEAR(created_at) DESC`,
      (err, data) => resolve(data),
    )
  })
}

export const getAllUsersIdsQuery = () => {
  return new Promise((resolve) => {
    db.query(`SELECT user_id FROM records GROUP BY user_id`, (err, data) => resolve(data))
  })
}

export const getListStatisticQuery = (userId, limit) => {
  return new Promise((resolve) => {
    db.query(
      `SELECT amount, created_at FROM records
        WHERE user_id = '${userId}'
        ORDER BY created_at DESC LIMIT ${limit}`,
      (err, data) => resolve(data),
    )
  })
}

export const getUserNameByIdQuery = (userId) => {
  return new Promise((resolve) => {
    db.query(
      `SELECT user_name FROM records
        WHERE user_id = '${userId}'
        LIMIT 1`,
      (err, data) => {
        const userName = data[0]?.user_name
        resolve(userName || '')
      },
    )
  })
}
