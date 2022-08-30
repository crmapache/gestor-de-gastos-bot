import express from 'express'
import { Telegraf } from 'telegraf'
import dotenv from 'dotenv'

import { calculateSum, createSendMessage } from './helpers.js'
import { startMonthlyNotificationTimer } from './timers.js'
import {
  actionNotAllowedMessage,
  adminHelpMessage,
  helpMessage,
  incorrectAmountMessage,
  instructionsMessage,
  monthStatisticMessage,
  successfullyChangedMessage,
  successfullyDeletedMessage,
  successfullyRecordedMessage,
  totalStatisticMessage,
  userFilledTankMessage,
  welcomeMessage,
  yearStatisticMessage,
} from './messages.js'
import {
  addQuery,
  deleteMutation,
  getMonthStatisticQuery,
  getTotalStatisticQuery,
  getYearStatisticQuery,
} from './queries.js'

dotenv.config()

class App {
  constructor(port, token, adminIds) {
    this.port = port
    this.app = express()
    this.bot = new Telegraf(token)
    this.sendMessage = createSendMessage(this.bot.telegram.sendMessage.bind(this.bot.telegram))
    this.adminIds = adminIds.split(',').map((id) => +id)
    this.notifyWhenUserFillTank = this.adminIds.reduce((acc, cur) => ({ ...acc, [cur]: true }), {})
    this.broadcast = (ids, message) => ids.map((id) => this.sendMessage(id, message))
  }

  start() {
    this.bot.start(async (ctx) => {
      const userId = ctx.update.message.from.id

      await this.sendMessage(userId, welcomeMessage())
      await this.sendMessage(userId, instructionsMessage())
      await this.sendMessage(userId, helpMessage())
    })

    this.bot.command('help', async (ctx) => {
      const userId = ctx.update.message.from.id

      if (this.adminIds.includes(userId)) {
        await this.sendMessage(userId, adminHelpMessage())
      } else {
        await this.sendMessage(userId, helpMessage())
      }
    })

    this.bot.command('month', async (ctx) => {
      const userId = ctx.update.message.from.id
      const statisticData = await getMonthStatisticQuery(userId)
      const sum = calculateSum(statisticData)

      await this.sendMessage(userId, monthStatisticMessage(sum))
    })

    this.bot.command('year', async (ctx) => {
      const userId = ctx.update.message.from.id
      const statisticData = await getYearStatisticQuery(userId)
      const sum = calculateSum(statisticData)

      await this.sendMessage(userId, yearStatisticMessage(sum))
    })

    this.bot.command('total', async (ctx) => {
      const userId = ctx.update.message.from.id
      const statisticData = await getTotalStatisticQuery(userId)
      const sum = calculateSum(statisticData)

      await this.sendMessage(userId, totalStatisticMessage(sum))
    })

    this.bot.command('delete', async (ctx) => {
      const userId = ctx.update.message.from.id

      await deleteMutation(userId)
      await this.sendMessage(userId, successfullyDeletedMessage())
    })

    this.bot.command('user_fill_tank_on', async (ctx) => {
      const userId = ctx.update.message.from.id

      if (this.adminIds.includes(userId)) {
        this.notifyWhenUserFillTank[userId] = true
        await this.sendMessage(userId, successfullyChangedMessage())
      } else {
        await this.sendMessage(userId, actionNotAllowedMessage())
      }
    })

    this.bot.command('user_fill_tank_off', async (ctx) => {
      const userId = ctx.update.message.from.id

      if (this.adminIds.includes(userId)) {
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
      const messageId = ctx.update.message.message_id

      if (!isNaN(amount)) {
        await addQuery(userId, userName, amount, messageId)
        await this.sendMessage(userId, successfullyRecordedMessage())

        if (this.adminIds.includes(userId) && this.notifyWhenUserFillTank) {
          this.broadcast(
            this.adminIds.filter((id) => id !== userId),
            userFilledTankMessage(userName, amount),
          )
        }
      } else {
        await this.sendMessage(userId, incorrectAmountMessage())
      }
    })

    this.bot.launch()
    this.app.listen(this.port, () => console.log(`My server is running on port ${this.port}`))
    startMonthlyNotificationTimer(this.sendMessage)
  }
}

const app = new App(process.env.PORT, process.env.TOKEN, process.env.ADMIN_IDS)
app.start()
