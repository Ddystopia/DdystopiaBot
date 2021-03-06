const { MessageEmbed } = require('discord.js')
const { RolesLeveling } = require('../../classes/RolesLeveling')
const { RoleForLeveling } = require('../../models/RoleForLeveling')
const { slider } = require('../../utils/slider')
const MAX_FIELDS = 25
class EmbedInstance extends MessageEmbed {
  constructor(avatarUrl) {
    super()
    this.setColor('#0099ff').setTitle('Market').setThumbnail(avatarUrl).setTimestamp()
  }
}
class RolesBoard {
  static async shopListOld(message) {
    const shopList = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Роли')
      .setThumbnail(message.author.avatarURL())
      .setTimestamp()
    const roles = sortAndClean(await RoleForLeveling.find({ guildId: message.guild.id }))
    let i = 0
    for (const roleId in roles) {
      if (!roles[roleId]) continue
      const role = message.member.guild.roles.cache.get(roleId)
      const level = roles[roleId]
      shopList.addField(++i, `${role} - ${level}`)
    }
    return message.reply(shopList)
  }
  static async shopList(message) {
    const roles = await RoleForLeveling.find({ guildId: message.guild.id }).sort({
      level: 'desc',
    })
    const embeds = []
    if (roles.length === 0)
      embeds.push(
        new EmbedInstance(message.author.avatarURL()).addField(`Пусто`, '\u200B')
      )
    for (let i = 0; i < Math.ceil(roles.length / MAX_FIELDS); i++) {
      const rolesChunk = roles.slice(i * MAX_FIELDS, (i + 1) * MAX_FIELDS)
      const shopList = new EmbedInstance(message.author.avatarURL())
      for (let j = 0; j < rolesChunk.length; j++) {
        const { id, level } = rolesChunk[j]
        shopList.addField(j + 1, `<@&${id}> - ${level}`)
      }
      embeds.push(shopList)
    }
    slider(embeds, message)
  }
  static async add(message, [, , level]) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return

    if (isNaN(+level)) return message.reply('Пропустили уровень')
    const [roleName] = message.content.match(/(?<=\[)(.+?)(?=])/)
    const role = message.guild.roles.cache.find(
      r => r.name.toLowerCase() === roleName.toLowerCase()
    )
    if (!role) return
    if (role.position >= message.guild.me.roles.highest.position)
      return message.reply('Извините, но эта роль слишком крута для простых смертных.')

    await RoleForLeveling.deleteOne({ id: role.id, guildId: message.guild.id })
    await new RoleForLeveling({
      id: role.id,
      level: +level,
      guildId: message.guild.id,
    }).save()

    RolesBoard.shopList(message)
  }
  static async remove(message) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return
    const [roleName] = message.content.match(/(?<=\[)(.+?)(?=])/)
    const role = message.guild.roles.cache.find(
      r => r.name.toLowerCase() === roleName.toLowerCase()
    )
    if (!role) return
    await RoleForLeveling.deleteOne({ id: role.id, guildId: message.guild.id })

    RolesBoard.shopList(message)
  }
}

module.exports.run = async (message, args) => {
  RolesBoard.roles = await RolesLeveling.getLevelingRoles()
  switch (args[0]) {
    case undefined:
    case null:
    case false:
      RolesBoard.shopList(message, args)
      break
    case 'add':
      RolesBoard.add(message, args)
      break
    case 'remove':
      RolesBoard.remove(message, args)
      break
    default:
      message.reply('Я не знаю, что вы от меня хотите')
  }
}

function sortAndClean(roles) {
  const rolesClone = {}
  Object.entries(roles)
    .sort((a, b) => +b[1] - +a[1])
    .forEach(e => {
      if (e[1] == null) return
      rolesClone[e[0]] = e[1]
    })
  return rolesClone
}

module.exports.help = {
  name: 'levelingRoles',
  aliases: ['lr'],
}
