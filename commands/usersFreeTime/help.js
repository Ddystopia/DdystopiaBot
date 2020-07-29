const { MessageEmbed } = require('discord.js')
const { Guild } = require('../../models/Guild')
const { rainbow } = require('../../utils/rainbow')
const { slider } = require('../../utils/slider')

class EmbedInstance extends MessageEmbed {
  constructor(title, prefix, rows) {
    super()
    this.setColor(rainbow())
      .setThumbnail(
        'https://cdn.discordapp.com/attachments/402109825896415232/692820764478668850/yummylogo.jpg'
      )
      .setTitle(title)
    rows.forEach((row, i) =>
      this.addField(i + 1, row.replace(/ +/gm, ' ').replace(/\|pref\|/g, prefix))
    )
    this.setFooter('Реакции нажимать чтоб листать')
  }
}

module.exports.run = async (message, args) => {
  const guildDB = await Guild.findOne({ id: message.guild.id })
  const embedProfile = new EmbedInstance('Команды профиля', guildDB.prefix, [
    `Если вы имеете лут 🎟, то вы можете обратится к администратору, и в замен он саздаст роль специально для вас!!!`,
    `|pref|profile [@упоминание] - показать профиль, если не будет аргумента, или он будет некоректен, покажет ваш. Псевдонимы - юзер, профиль`,
    `|pref|rank [@упоминание] - узнать короткие показатели своего уровня. Псевдонимы - ранг `,
    `|pref|birthday [YYYY-MM-DD] - установить день рождения`,
    `|pref|about [text] - рассказать о себе, чтоб пеевести строку, используйте \\n`,
    `|pref|marry [@упоминание] - пожениться с пользователем, вы оба должны иметь лут💍, если пользователь напишет такую же комнду с пингом на вас, в профиле отобразит вашу половинку `,
    `|pref|tear - порвать брак`,
    `|pref|loot  - собрать случайный лут`,
    `|pref|giveLoot [@упоминание] [ [лут]+ / all ] - дать кому-то лут`,
    `|pref|lootBox - открыть лутбокс, который вы должны предварительно купить (🎁)`,
    `|pref|ship [@упоминание]{2,} - шипперство, от 2х и более пингов
  Пример: |pref|ship @Right @Left`,
    `|pref|levelingRoles - таблица уровней и ролей `,
  ])

  const embedGames = new EmbedInstance('Команды игр', guildDB.prefix, [
    `|pref|ttt [bet] [@упоминание] - крестики нолики, бот поставит реакцию, чтоб присоединиться, надо на неё нажать, играть просто отправляя числа, если указать пользователя, другие будут игнорироваться, аргумента можно менять местами Псевдонимы - ттт`,
    `|pref|cities symbol - узнать букву, с которой должно начинаться слово, полезно когда кто-то удалил или изменил своё сообщение`,
  ])

  const embedCasino = new EmbedInstance('Команды казино', guildDB.prefix, [
    `Кляньчить деньши у администрации запрещено, карается счётом -100000`,
    `|pref|daily [up / level] [n] - раз в 12 часов, можно улучшать. Псевдонимы - timely`,
    `|pref|br [sum / all]`,
    `|pref|wheel [sum / all]`,
    `|pref|cf [sum / all] [t / h]`,
    `|pref|money [@упоминание] - узнать баланс (если вы допустите ошибку в аргументах или не укажите их, покажет ваши значения). Псевдонимы - $, balance`,
    `|pref|give [sum] [@упоминание] - Больше 10к нельзя(если вы будете передавать много раз, то на 50к вам дадут пред, на 60к мут)`,
    `|pref|lb [page] - таблица лидеров`,
  ])

  const embedBank = new EmbedInstance('Команды банка', guildDB.prefix, [
    `|pref|bank create deposit [sum] [days] - создать депозит(чтобы расчитать выгодный процент, рекомендую посмотреть на график)
     Пример: |pref|bank create deposit 10000 10`,
    `|pref|bank create credit [sum] [days] - создать кредит(чтобы расчитать выгодный процент, рекомендую посмотреть на график)
    (Не больше 100000, не меньше 1000, не больше 4 дней; если сумма меньше 50000, то не больше 2 дня; сумма кредита должна быть не более чем в 15 раз выше уже имеющейся)
    Пример: |pref|bank create credit 100000 4
    Пример: |pref|bank create credit 100000 -4(дадада, даже на отрицательно время брать можно. не баг а фича)`,
    `|pref|bank repay credit [sum] - сделать выплату кредита
     (Не раньше чем через 3 часа после выдачи кредита)
     Пример: |pref|bank create credit 90000 4`,
    `|pref|bank repay deposit [sum] - доложить на депозит`,
    `|pref|bank info - посмотреть свою информацию по кредиту / депозиту`,
  ])
  if (!guildDB.bancrotRoleId)
    embedBank.setDescription(
      'Эта комманда не доступна для этого сервера, попросите администратора добавить банкротскую роль'
    )

  const embedPercents = new EmbedInstance('Как считаются проценты:', guildDB.prefix, [
    `
График на Кредит:
Х это сумма кредита делёная на 10 000, Y это процент, берётся самое высокое значение Y:
http://yotx.ru/#!1/3_h/ubW/ugfSOG8L@2f7R/sH@w7yel1vY3NzbWwKe763ubZ2e7@wf7JBp2A8Z43DplPO6cne3ub@1vbuxtbu2Cz6A7Z/sH@yQadgN0wHjcAW0xHkEHu/tb@1tn@wf7JBp2YwuGYDweMB4Pdve39gEH
\`\`\`js
Math.max(-((Math.E * 6) ** (sum / 1e+4) - 55), -((sum / 1e+4) - 1) * 5 + 25, 15)\`\`\`

График на Депозит:
Х это количество дней а делёное на 10, Y это процент, берётся самое низкое значение Y, и результат делится на 2.35:
http://yotx.ru/#!1/3_h/ubW/ugfSOG8L@2f7R/sH@w7yel1vY31tZPd9f3ti/2D/ZJNOwGjPG4dcp43Dk7293f2t/Y29zaBZ9CzqBbZ/sH@yQadgN0wHjcAW0xHkEHu/tb@zsH@wf7JBp2YwuGYDweMB4Pdve39gEH
\`\`\`js
(Math.E ** 6) ** (days / 10) / 3, ((days / 10) - 1) * 6.5 + 15, 20) / 2.75\`\`\`
    `,
  ])

  const embedShop = new EmbedInstance('Команды магазина ролей', guildDB.prefix, [
    `|pref|shop - посмотреть таблицу`,
    `|pref|shop buy [number on table] - купить роль`,
    `|pref|shop sell [number on table] - продать роль`,
  ])

  const embedShop2 = new EmbedInstance('Команды магазина вещей', guildDB.prefix, [
    `|pref|market - посмотреть таблицу`,
    `|pref|market buy [лут]+ - купить лут`,
    `|pref|market sell [ [лут]+/all ] - продать лут
Пример: |pref|market buy 🎁
Пример: |pref|market buy 🎁🎟
Пример: |pref|market sell all`,
  ])

  const embedHentai = new EmbedInstance('Хентай команды', guildDB.prefix, [
    `
|pref|hentai [genre] [n] - аргументы не обязательны
1 >= n <= 15
Доступные жанры(их писать вместо [genre], максимум 1 жанр за вызов)
 | randomHentaiGif | pussy | nekoGif | neko | lesbian |
 | kuni | cumsluts | classic | boobs | bJ |
 | anal | yuri | yaoi | trap | tits | eroKitsune |
 | girlSoloGif | girlSolo | pussyWankGif | pussyArt | kemonomimi |
 | kitsune | keta | holo | holoEro | hentai |
 | futanari | femdom | feetGif | eroFeet | feet |
 | ero | avatar | eroKemonomimi| eroNeko  |eroYuri |
 | cumArts | blowJob | spank | gasm |
Есть ещё жанры, но они не стоят упоминания сдесь
  `,
  ])

  const embedActions = new EmbedInstance('Команды действий', guildDB.prefix, [
    `
|pref|[command] [@упоминание] - аргументы не обязательны

Доступные действия(их писать вместо [conmmand])
 | smug | baka | tickle | slap | poke | 
 | pat | neko | nekoGif | meow | lizard | 
 | kiss | hug | foxGirl | feed | cuddle | 
 | kemonomimi | holo | woof | wallpaper |  
 | gecg | avatar | waifu | why | goose |
 | catText | OwOify | 8Ball | spoiler |
 | fact | 
  `,
  ])

  const embedModeration = new EmbedInstance('Модерации', guildDB.prefix, [
    `|pref|bank remove [credit/deposit/bancrot] [@упоминание] - удалить кредит / депозит / банкрот`,
    `|pref|reward [sum / -all(снять всё)] [@упоминание]`,
    `|pref|setRoleEveryone [ИМЯ роли] [basic / -] [delIfAnother] - без флага basic даст всем онлайн пользователям роль, с флагом basic и без delIfAnother даст только тем, у кого ролей нет, с delIfAnother ещё и удалит у тех, у кого есть роли`,
    `|pref|shop add [@упоминание роли] [sum] - Добавить роль в таблицу / Изменить цену роли`,
    `|pref|shop remove [@упоминание роли] - Удалить роль из таблицы`,
    `|pref|market add [лут] [sum] - Добавить лут в таблицу / Изменить цену роли`,
    `|pref|market remove [лут] - Удалить лут из таблицы`,
    `|pref|embed [#упоминание канала] [JSON] - для генерации json-а используйте https://eb.nadeko.bot/ , сами не пишите`,
    `|pref|cities clear - очистить массив слов`,
    `|pref|cities addtWords [JSON] - добавить массив слов`,
    `|pref|cities setWords [JSON] - добавить массив слов`,
    `|pref|level [level] [@упоминание] - установить уровень пользователю`,
    `|pref|levelingRoles add [[Имя роли]] [уровень] - добавить роль`,
    `|pref|levelingRoles remove [[Имя роли]] - убрать роль
    Пример: |pref|levelingRoles add [Нолайфер] 34`,
  ])
  const embeds = [
    embedProfile,
    embedGames,
    embedCasino,
    embedBank,
    embedPercents,
    embedShop,
    embedShop2,
    embedActions,
    embedHentai,
    embedModeration,
  ]
  slider(embeds, message, args[0])
}

module.exports.help = {
  name: 'help',
}
