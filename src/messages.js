const message = (ctx, message) => {
  return new Promise((resolve) => {
    ctx.reply(message).then(() => {
      resolve()
    })
  })
}

export const welcomeMessage = ctx => {
  const text = 'Bienvenido!🎉\n' +
    'Este bot te ayudará calcular gastos de gasolina 📝'
  
  return message(ctx, text)
}

export const instructionsMessage = ctx => {
  const text = 'Cada vez cuando echas gasolina, antes de pagar manda el precio q pagas aqui, nada mas.\n\n' +
    'En fin de mes vas a tener mensaje con suma total q pagaste por gasolina en este mes.\n\n' +
    'Abajo te voy a mandar comandos que puedes usar para obtener ayuda o mas informacion'
  
  return message(ctx, text)
}

export const helpMessage = ctx => {
  const text = '/help - todos los comandos\n\n' +
    '/month - estatistica por este mes\n' +
    '/year - estatistica por este año\n' +
    '/total - estadística por todo el tiempo\n\n' +
    '/month_all - estatistica por este mes para todos los usarios\n' +
    '/year_all - estatistica por este año para todos los usarios\n' +
    '/total_all - estadística por todo el tiempo para todos los usarios\n\n' +
    '/delete - borrar monto previamente ingresado\n'
  
  return message(ctx, text)
}

export const incorrectAmountMessage = ctx => {
  const text = '⚠️ Necesitas mandarme número válido'
  
  return message(ctx, text)
}

export const successfullyRecordedMessage = ctx => {
  const text = '✅ registrado'
  
  return message(ctx, text)
}

export const successfullyDeletedMessage = ctx => {
  const text = '✅ eliminado'
  
  return message(ctx, text)
}

export const statisticMessage = (ctx, text) => {
  return message(ctx, text)
}
