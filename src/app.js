import express from 'express'
import { Telegraf } from 'telegraf'
import dotenv from 'dotenv'

import { createSendMessage } from './helpers.js'
import { startMonthlyNotificationTimer } from './timers.js'
import {
  actionNotAllowedMessage,
  adminHelpMessage,
  helpMessage,
  incorrectAmountMessage,
  instructionsMessage,
  listStatisticMessage,
  listStatisticTitleMessage,
  monthStatisticAdminMessage,
  monthStatisticMessage,
  successfullyChangedMessage,
  successfullyDeletedMessage,
  successfullyRecordedMessage,
  totalExtendedStatisticMessage,
  totalStatisticMessage,
  userFilledTankMessage,
  welcomeMessage,
  yearExtendedStatisticMessage,
  yearStatisticMessage,
} from './messages.js'
import {
  addQuery,
  deleteMutation,
  getAllUsersIdsQuery,
  getListStatisticQuery,
  getMonthStatisticQuery,
  getTotalExtendedStatisticQuery,
  getTotalStatisticQuery,
  getUserNameByIdQuery,
  getYearExtendedStatisticQuery,
  getYearStatisticQuery,
} from './queries.js'

dotenv.config()

class App {
  constructor(port, token, adminsIds) {
    this.port = port
    this.app = express()
    this.bot = new Telegraf(token)
    this.sendMessage = createSendMessage(this.bot.telegram.sendMessage.bind(this.bot.telegram))
    this.adminsIds = adminsIds.split(',').map((id) => +id)
    this.notifyWhenUserFillTank = this.adminsIds.reduce((acc, cur) => ({ ...acc, [cur]: true }), {})
    this.broadcast = (ids, message) => ids.map((id) => this.sendMessage(id, message))
  }

  start() {
    this.bot.start(async (ctx) => {
      const userId = ctx.update.message.from.id

      await this.sendMessage(userId, welcomeMessage())
      await this.sendMessage(userId, instructionsMessage())

      if (this.adminsIds.includes(userId)) {
        await this.sendMessage(userId, adminHelpMessage())
      } else {
        await this.sendMessage(userId, helpMessage())
      }
    })

    this.bot.command('help', async (ctx) => {
      const userId = ctx.update.message.from.id

      if (this.adminsIds.includes(userId)) {
        await this.sendMessage(userId, adminHelpMessage())
      } else {
        await this.sendMessage(userId, helpMessage())
      }
    })

    this.bot.command('month', async (ctx) => {
      const userId = ctx.update.message.from.id
      const sum = await getMonthStatisticQuery(userId)

      await this.sendMessage(userId, monthStatisticMessage(sum))

      if (this.adminsIds.includes(userId)) {
        const allUsersIdsData = await getAllUsersIdsQuery()
        const allUsersIdsExceptCurrentUser = allUsersIdsData.filter((el) => +el.user_id !== userId)
        const monthSumForEachUser = {}

        for (const el of allUsersIdsExceptCurrentUser) {
          const id = el.user_id
          const userName = await getUserNameByIdQuery(id)
          const userSum = await getMonthStatisticQuery(id)

          if (userSum > 0) {
            monthSumForEachUser[userName] = userSum
          }
        }

        await this.sendMessage(userId, monthStatisticAdminMessage(monthSumForEachUser), {
          parse_mode: 'HTML',
        })
      }
    })

    this.bot.command('year', async (ctx) => {
      const userId = ctx.update.message.from.id
      const sum = await getYearStatisticQuery(userId)
      const monthsSum = await getYearExtendedStatisticQuery(userId)

      await this.sendMessage(userId, yearStatisticMessage(sum))
      await this.sendMessage(userId, yearExtendedStatisticMessage(monthsSum), {
        parse_mode: 'HTML',
      })
    })

    this.bot.command('total', async (ctx) => {
      const userId = ctx.update.message.from.id
      const sum = await getTotalStatisticQuery(userId)
      const yearsSum = await getTotalExtendedStatisticQuery(userId)

      await this.sendMessage(userId, totalStatisticMessage(sum))
      await this.sendMessage(userId, totalExtendedStatisticMessage(yearsSum), {
        parse_mode: 'HTML',
      })
    })

    this.bot.hears(/^\/list(_\d+)?$/, async (ctx) => {
      const userId = ctx.update.message.from.id
      const recordsAmount = (ctx.match[1] && +ctx.match[1].replace('_', '')) || 10
      const statisticData = await getListStatisticQuery(userId, recordsAmount)

      await this.sendMessage(userId, listStatisticTitleMessage())
      await this.sendMessage(userId, listStatisticMessage(statisticData), { parse_mode: 'HTML' })
    })

    this.bot.command('delete', async (ctx) => {
      const userId = ctx.update.message.from.id

      await deleteMutation(userId)
      await this.sendMessage(userId, successfullyDeletedMessage())
    })

    this.bot.command('user_fill_tank_on', async (ctx) => {
      const userId = ctx.update.message.from.id

      if (this.adminsIds.includes(userId)) {
        this.notifyWhenUserFillTank[userId] = true

        await this.sendMessage(userId, successfullyChangedMessage())
      } else {
        await this.sendMessage(userId, actionNotAllowedMessage())
      }
    })

    this.bot.command('user_fill_tank_off', async (ctx) => {
      const userId = ctx.update.message.from.id

      if (this.adminsIds.includes(userId)) {
        this.notifyWhenUserFillTank[userId] = false

        await this.sendMessage(userId, successfullyChangedMessage())
      } else {
        await this.sendMessage(userId, actionNotAllowedMessage())
      }
    })

    this.bot.on('text', async (ctx) => {
      const userId = ctx.update.message.from.id
      const userName = ctx.update.message.from.first_name
      const amount = ctx.update.message.text

      if (!isNaN(amount)) {
        await addQuery(userId, userName, amount)
        await this.sendMessage(userId, successfullyRecordedMessage())

        const adminsIdsToNotify = this.adminsIds.filter(
          (adminId) => adminId !== userId && this.notifyWhenUserFillTank[adminId],
        )

        this.broadcast(adminsIdsToNotify, userFilledTankMessage(userName, +amount))
      } else {
        await this.sendMessage(userId, incorrectAmountMessage())
      }
    })

    this.bot.launch()
    this.app.listen(this.port, () => console.log(`Bot is running on port ${this.port}`))
    startMonthlyNotificationTimer(this.sendMessage, this.adminsIds)
  }
}

const app = new App(process.env.PORT, process.env.TOKEN, process.env.ADMINS_IDS)
app.start()
