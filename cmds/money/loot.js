const User = require('../../classes/User')
const randomInteger = require('../../utils/randomInteger')
const formatDuration = require('../../utils/formatDuration')
const readWrite = require('../../utils/readWriteFile.js')
const SECONDS_COOLDOWN = 60 * 60 * 24
const MAX_DAILY_LOOT_COST = 5000

module.exports.run = async (client, message, args, command) => {
  const loot = readWrite('loot.json')
  switch (command) {
    case 'loot': {
      const user = User.getOrCreateUser(message.author.id)
      if (Date.now() - user.timers.loot < 1000 * SECONDS_COOLDOWN)
        return message.reply(
          `Вы уже получили свою долю, следующий раз получить можно через ${formatDuration(
            SECONDS_COOLDOWN - (Date.now() - user.timers.loot) / 1000
          )}`
        )
      const winnedLoot = calcLoot(loot, MAX_DAILY_LOOT_COST)
      user.addLoot([winnedLoot])

      user.timers.loot = Date.now()
      user.save()
      message.reply(
        `Вы получили ${winnedLoot}, следующий раз получить можно через 24 часа`
      )
      break
    }

    case 'giveloot': {
      if (!message.mentions.users.first()) return
      const userFrom = User.getOrCreateUser(message.author.id)
      const userTill = User.getOrCreateUser(message.mentions.users.first().id)
      const lootArray = userFrom.getLootArray(args.slice(1), loot)

      if (lootArray.length < 1) return message.reply('Не продаётся')

      userFrom.removeLoot(lootArray)
      userTill.addLoot(lootArray)

      message.react('✅')
      userFrom.save()
      userTill.save()
      break
    }
    case 'lootbox': {
      const user = User.getOrCreateUser(message.author.id)
      if (!user.loot['🎁']) return message.reply('Нечего открывать ¯\\_(ツ)_/¯')
      user.removeLoot(['🎁'])
      const number = randomInteger(0, 100)

      let maxCost = 0
      if (number === 0) maxCost = 2e4
      else if (number > 90) maxCost = 9e6
      else if (number > 85) maxCost = 1e6
      else if (number > 75) maxCost = 2e4
      else maxCost = MAX_DAILY_LOOT_COST

      const winnedLoot = calcLoot(loot, maxCost)
      user.addLoot([winnedLoot])
      user.save()
      message.reply(`Вы получили ${winnedLoot}`)
    }
  }
}

function calcLoot(loot, maxCost = MAX_DAILY_LOOT_COST) {
  const loots = Object.entries(loot)
    .filter(line => line[1] <= maxCost)
    .map(item => item[0])
  const winnedLoot = loots[randomInteger(0, loots.length - 1)]
  return winnedLoot
}

module.exports.help = {
  aliases: ['loot', 'giveloot', 'lootbox'],
  cmdList: true,
}
