import express from 'express'
import { Telegraf } from 'telegraf'
import dotenv from 'dotenv'
import {
  helpMessage,
  incorrectAmountMessage,
  instructionsMessage,
  statisticMessage,
  successfullyDeletedMessage,
  successfullyRecordedMessage,
  welcomeMessage,
} from './messages.js'
import {
  addQuery,
  deleteMutation,
  getMonthStatisticQuery,
  getTotalStatisticQuery,
  getYearStatisticQuery,
} from './queries.js'

dotenv.config()
const app = express()
const bot = new Telegraf(process.env.TOKEN)

bot.start(async (ctx) => {
  await welcomeMessage(ctx)
  await instructionsMessage(ctx)
  await helpMessage(ctx)
})

bot.command('help', async (ctx) => {
  await helpMessage(ctx)
})

bot.command('month', async (ctx) => {
  const userId = ctx.update.message.from.id

  const message = await getMonthStatisticQuery(userId)

  await statisticMessage(ctx, message)
})

bot.command('year', async (ctx) => {
  const userId = ctx.update.message.from.id

  const message = await getYearStatisticQuery(userId)

  await statisticMessage(ctx, message)
})

bot.command('total', async (ctx) => {
  const userId = ctx.update.message.from.id

  const message = await getTotalStatisticQuery(userId)

  await statisticMessage(ctx, message)
})

bot.command('month_all', async (ctx) => {
  await statisticMessage(ctx, 'month-all')
})

bot.command('year_all', async (ctx) => {
  await statisticMessage(ctx, 'year-all')
})

bot.command('total_all', async (ctx) => {
  await statisticMessage(ctx, 'total-all')
})

bot.command('delete', async (ctx) => {
  const userId = ctx.update.message.from.id

  await deleteMutation(userId)
  await successfullyDeletedMessage(ctx)
})

bot.on('text', async (ctx) => {
  const userId = ctx.update.message.from.id
  const userName = ctx.update.message.from.first_name
  const amount = ctx.update.message.text
  const messageId = ctx.update.message.message_id

  if (!isNaN(amount)) {
    await addQuery(userId, userName, amount, messageId)
    await successfullyRecordedMessage(ctx)
  } else {
    await incorrectAmountMessage(ctx)
  }
})

bot.launch()
app.listen(process.env.PORT, () => console.log(`My server is running on port ${process.env.PORT}`))
