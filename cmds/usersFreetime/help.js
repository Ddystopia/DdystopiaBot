const { MessageEmbed } = require('discord.js')
const { Guild } = require('../../models/Guild')
const { rainbow } = require('../../utils/rainbow')
const { slider } = require('../../utils/slider')

class EmbedInstance extends MessageEmbed {
  constructor(title) {
    super()
    this.setColor(rainbow())
      .setThumbnail(
        'https://cdn.discordapp.com/attachments/402109825896415232/692820764478668850/yummylogo.jpg'
      )
      .setTitle(title)
  }
}

module.exports.run = async (message, args) => {
  const guildInfo = await Guild.findOne({ id: message.guild.id })
  const replacePref = ([string]) => string.replace(/\|pref\|/g, guildInfo.prefix)
  const embedIntroduction = new EmbedInstance('Введение')
    .addField(
      '\u200B',
      `Бот ещё пишется, и в будущем комманд будет больше.\nЕсли увидите баг, соообщите модерации и не пользуйтесь им.\nЕсли что-то не ясно, спросите у пользователей онлайн, и поменьше трогайте модерацию(они злые)`
    )
    .setFooter('Реакции нажимать чтоб листать')

  const embedProfile = new EmbedInstance('Команды профиля')
    .addField(
      '\u200B',
      replacePref`
		Если вы имеете лут 🎟, то вы можете обратится к администратору, и в замен он саздаст роль специально для вас!!!
	1. |pref|profile [@упоминание] - показать профиль, если не будет аргумента, или он будет некоректен, покажет ваш. Псевдонимы - юзер, профиль
	2. |pref|rank [@упоминание] - узнать короткие показатели своего уровня. Псевдонимы - ранг 
	3. |pref|birthday [YYYY-MM-DD] - установить день рождения
	4. |pref|about [text] - рассказать о себе, чтоб пеевести строку, используйте \\n
	5. |pref|marry [@упоминание] - пожениться с пользователем, вы оба должны иметь лут💍, если пользователь напишет такую же комнду с пингом на вас, в профиле отобразит вашу половинку 
	6. |pref|tear - порвать брак
	7. |pref|loot  - собрать случайный лут
	8. |pref|giveLoot [@упоминание] [ [лут]+ / all ] - дать кому-то лут
	9. |pref|lootBox - открыть лутбокс, который вы должны предварительно купить (🎁)
	10. |pref|ship [@упоминание]{2,} - шипперство, от 2х и более пингов
	11. levelingRoles - таблица уровней и ролей 
	Пример: |pref|ship @Right @Left
	`
    )
    .setFooter('Реакции нажимать чтоб листать')

  const embedGames = new EmbedInstance('Команды игр').addField(
    '\u200B',
    replacePref`
		1. |pref|ttt [bet] [@упоминание] - крестики нолики, бот поставит реакцию, чтоб присоединиться, надо на неё нажать, играть просто отправляя числа, если указать пользователя, другие будут игнорироваться, аргумента можно менять местами Псевдонимы - ттт
		2. |pref|cities symbol - узнать букву, с которой должно начинаться слово, полезно когда кто-то удалил или изменил своё сообщение
	`
  )

  const embedCasino = new EmbedInstance('Команды казино').addField(
    '\u200B',
    replacePref`Кляньчить деньши у администрации запрещено, карается счётом -100000
1. |pref|daily [up / level] [n] - раз в 12 часов, можно улучшать. Псевдонимы - timely
2. |pref|br [sum / all]
3. |pref|wheel [sum / all]
4. |pref|cf [sum / all] [t / h]
5. |pref|money [@упоминание] - узнать баланс (если вы допустите ошибку в аргументах или не укажите их, покажет ваши значения). Псевдонимы - $, balance
6. |pref|give [sum] [@упоминание] - Больше 10к нельзя(если вы будете передавать много раз, то на 50к вам дадут пред, на 60к мут)
7. |pref|lb [page] - таблица лидеров

За активность в #🎪┃мемы  и #🔞┃nsfw  вам будут капать деньги
		`
  )

  const embedBank = new EmbedInstance('Команды банка #🏧┃банк').addField(
    '\u200B',
    replacePref`
1. |pref|bank create deposit [sum] [days] - создать депозит(чтобы расчитать выгодный процент, рекомендую посмотреть на график)
Пример: |pref|bank create deposit 10000 10
2. |pref|bank create credit [sum] [days] - создать кредит(чтобы расчитать выгодный процент, рекомендую посмотреть на график)
(Не больше 100000, не меньше 1000, не больше 4 дней; если сумма меньше 50000, то не больше 2 дня; сумма кредита должна быть не более чем в 15 раз выше уже имеющейся)
Пример: |pref|bank create credit 100000 4
Пример: |pref|bank create credit 100000 -4(дадада, даже на отрицательно время брать можно. не баг а фича)
3. |pref|bank repay credit [sum] - сделать выплату кредита
(Не раньше чем через 3 часа после выдачи кредита)
Пример: |pref|bank create credit 90000 4
4. |pref|bank repay deposit [sum] - доложить на депозит
5. |pref|bank info - посмотреть свою информацию по кредиту / депозиту
		`
  )
  if (!guildInfo.bancrotRoleId)
    embedBank.setDescription(
      'Эта комманда не доступна для этого сервера, попросите администратора добавить банкротскую роль'
    )

  const embedPercents = new EmbedInstance('Как считаются проценты:').addField(
    '\u200B',
    replacePref`
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

===============================
Если есть возможность, предлогайте свои графики, ибо 2.75 это просто затычка
		`
  )

  const embedShop = new EmbedInstance('Команды магазина ролей').addField(
    '\u200B',
    replacePref`
1. |pref|shop - посмотреть таблицу
2. |pref|shop buy [number on table] - купить роль
3. |pref|shop sell [number on table] - продать роль`
  )

  const embedShop2 = new EmbedInstance('Команды магазина вещей').addField(
    '\u200B',
    replacePref`
1. |pref|market - посмотреть таблицу
2. |pref|market buy [лут]+ - купить лут
3. |pref|market sell [ [лут]+/all ] - продать лут
Пример: |pref|market buy 🎁
Пример: |pref|market buy 🎁🎟
Пример: |pref|market sell all
`
  )

  const embedHentai = new EmbedInstance('Хентай команды').addField(
    '\u200B',
    replacePref`
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
	`
  )

  const embedActions = new EmbedInstance('Команды действий').addField(
    '\u200B',
    replacePref`
|pref|[command] [@упоминание] - аргументы не обязательны

Доступные действия(их писать вместо [conmmand])
 | smug | baka | tickle | slap | poke | 
 | pat | neko | nekoGif | meow | lizard | 
 | kiss | hug | foxGirl | feed | cuddle | 
 | kemonomimi | holo | woof | wallpaper |  
 | gecg | avatar | waifu | why | goose |
 | catText | OwOify | 8Ball | spoiler |
 | fact | 
	`
  )

  const embedModeration = new EmbedInstance('Модерации').addField(
    '\u200B',
    replacePref`
1. |pref|bank remove [credit/deposit/bancrot] [@упоминание] - удалить кредит / депозит / банкрот
2. |pref|reward [sum / -all(снять всё)] [@упоминание]
3. |pref|setRoleEveryone [ИМЯ роли] [basic / -] [delIfAnother] - без флага basic даст всем онлайн пользователям роль, с флагом basic и без delIfAnother даст только тем, у кого ролей нет, с delIfAnother ещё и удалит у тех, у кого есть роли
4. |pref|shop add [@упоминание роли] [sum] - Добавить роль в таблицу / Изменить цену роли
5. |pref|shop remove [@упоминание роли] - Удалить роль из таблицы
6. |pref|market add [лут] [sum] - Добавить лут в таблицу / Изменить цену роли
7. |pref|market remove [лут] - Удалить лут из таблицы
8. |pref|embed [#упоминание канала] [JSON] - для генерации json-а используйте https://eb.nadeko.bot/ , сами не пишите
9. |pref|cities clear - очистить массив слов
10. |pref|cities addtWords [JSON] - добавить массив слов
11. |pref|cities setWords [JSON] - добавить массив слов
12. |pref|level [level] [@упоминание] - установить уровень пользователю
13. |pref|levelingRoles add [[Имя роли]] [уровень] - добавить роль
14. |pref|levelingRoles remove [[Имя роли]] - убрать роль
Пример: |pref|levelingRoles add [Нолайфер] 34
		`
  )
  const embeds = [
    embedIntroduction,
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
