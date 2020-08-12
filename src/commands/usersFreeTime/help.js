const { MessageEmbed } = require('discord.js')
const { Guild } = require('../../models/Guild')
const { rainbow } = require('../../utils/rainbow')
const { slider } = require('../../utils/slider')

class EmbedInstance extends MessageEmbed {
  constructor({ title, prefix, rows, icon }) {
    super()
    this.setColor(rainbow()).setThumbnail(icon).setTitle(title)
    rows.forEach((row, i) =>
      this.addField(i + 1, row.replace(/ +/gm, ' ').replace(/\|pref\|/g, prefix))
    )
    this.setFooter('Реакции нажимать чтоб листать')
  }
}

const pages = [
  {
    title: 'Команды профиля',
    rows: [
      `|pref|profile @упоминание  - показать профиль, если не будет аргумента, или он будет некоректен, покажет ваш. Псевдонимы - юзер, профиль`,
      `|pref|rank @упоминание  - узнать короткие показатели своего уровня. Псевдонимы - ранг `,
      `|pref|selfrole [name]  color(hex - ищите в гугле "color picker")  - сохдать селфроль, только при наличии лута 🎟`,
      `|pref|birthday YYYY-MM-DD  - установить день рождения`,
      `|pref|about (text)  - рассказать о себеd`,
      `|pref|marry @упоминание  - пожениться с пользователем, вы оба должны иметь лут💍, если пользователь напишет такую же комнду с пингом на вас, в профиле отобразит вашу половинку `,
      `|pref|tear - порвать брак`,
      `|pref|loot - собрать случайный лут`,
      `|pref|idea (ваша идея)  - отпрвить идею по улучшению сервера и тд`,
      `|pref|lb (page)  - таблица лидеров по уровню`,
      `|pref|giveLoot @упоминание  ([лут]+ / all)  - дать кому-то лут`,
      `|pref|lootBox - открыть лутбокс, который вы должны предварительно купить (🎁)`,
      `|pref|ship @упоминание]{2,} - шипперство, от 2х и более пингов
	Пример: |pref|ship @Right @Left`,
      `|pref|levelingRoles - таблица уровней и ролей `,
    ],
  },
  {
    title: 'Команды игр',
    rows: [
      `|pref|ttt (bet)  @упоминание  - крестики нолики, бот поставит реакцию, чтоб присоединиться, надо на неё нажать, играть просто отправляя числа, если указать пользователя, другие будут игнорироваться, аргумента можно менять местами Псевдонимы - ттт`,
      `|pref|cities symbol - узнать букву, с которой должно начинаться слово, полезно когда кто-то удалил или изменил своё сообщение`,
      `|pref|8ball (ваш вопрос)  - задать вопрос волшебному шару`,
    ],
  },
  {
    title: 'Команды казино',
    rows: [
      `Кляньчить деньги у администрации запрещено, карается счётом -100000`,
      `|pref|daily (up / level)  [n  - раз в 12 часов, можно улучшать. Псевдонимы - timely`,
      `|pref|br (sum / all)`,
      `|pref|wheel (sum / all)`,
      `|pref|cf (sum / all)  (t / h)`,
      `|pref|money @упоминание  - узнать баланс (если вы допустите ошибку в аргументах или не укажите их, покажет ваши значения). Псевдонимы - $, balance`,
      `|pref|give (sum)  [@упоминание  - Больше 10к нельзя(если вы будете передавать много раз, то на 50к вам дадут пред, на 60к мут)`,
      `|pref|forbs (page)  - таблица лидеров по активам`,
    ],
  },
  {
    title: 'Команды банка',
    rows: [
      `|pref|bank create deposit (sum)  (days)  - создать депозит(чтобы расчитать выгодный процент, рекомендую посмотреть на график)
		 Пример: |pref|bank create deposit 10000 10`,
      `|pref|bank create credit (sum)  (days)  - создать кредит(чтобы расчитать выгодный процент, рекомендую посмотреть на график)
		(Не больше 100000, не меньше 1000, не больше 4 дней; если сумма меньше 50000, то не больше 2 дня; сумма кредита должна быть не более чем в 15 раз выше уже имеющейся)
		Пример: |pref|bank create credit 100000 4
		Пример: |pref|bank create credit 100000 -4(дадада, даже на отрицательно время брать можно. Не баг, а фича)`,
      `|pref|bank repay credit (sum)  - сделать выплату кредита
		 (Не раньше чем через 3 часа после выдачи кредита)
		 Пример: |pref|bank create credit 90000 4`,
      `|pref|bank repay deposit (sum)  - доложить на депозит`,
      `|pref|bank info - посмотреть свою информацию по кредиту / депозиту`,
    ],
  },
  {
    title: 'Как считаются проценты:',
    rows: [
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
    ],
  },
  {
    title: 'Команды магазина ролей',
    rows: [
      `|pref|shop - посмотреть таблицу`,
      `|pref|shop buy [имя роли]  - купить роль
Пример: |pref|shop buy [cool mod]`,
      `|pref|shop sell [имя роли]  - продать роль`,
    ],
  },
  {
    title: 'Команды магазина вещей',
    rows: [
      `|pref|market - посмотреть таблицу`,
      `|pref|market buy лут - купить лут`,
      `|pref|market sell  (лут/all)   - продать лут
Пример: |pref|market buy 🎁
Пример: |pref|market buy 🎁🎟
Пример: |pref|market sell all`,
    ],
  },
  {
    title: 'Хентай команды',
    rows: [
      `
|pref|hentai genre  (n)  - аргументы не обязательны
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
    ],
  },
  {
    title: 'Команды действий',
    rows: [
      `
|pref|(action) @упоминание  - аргументы не обязательны
Пример: |pref|meow
Пример: |pref|hug @admin

Доступные действия(их писать вместо [conmmand])
| smug | baka | tickle | slap | poke | 
| pat | neko | nekoGif | meow | lizard | 
| kiss | hug | foxGirl | feed | cuddle | 
| kemonomimi | holo | woof | wallpaper |  
| gecg | avatar | waifu | why | goose |
`,
    ],
  },
  {
    title: 'Модерации',
    rows: [
      `|pref|bank remove (credit/deposit/bankrup)t  @упоминание  - удалить кредит / депозит / банкрот`,
      `|pref|reward (sum / -all(снять всё))  @упоминание`,
      `|pref|setRoleEveryone [ИМЯ роли]  (basic / -)  (delIfAnother) - ***[ОПАСНОСТЬ]*** без флага basic даст всем пользователям роль, с флагом basic и без delIfAnother даст только тем, у кого ролей нет, с delIfAnother ещё и удалит у тех, у кого есть роли`,
      `|pref|shop add [имя роли]  sum  - Добавить роль в таблицу / Изменить цену роли`,
      `|pref|shop remove [имя роли]  - Удалить роль из таблицы`,
      `|pref|market add лут sum  - Добавить лут в таблицу / Изменить цену лута, можно и эмоджи сервера`,
      `|pref|market remove лут  - Удалить лут из таблицы`,
      `|pref|embed (#упоминание канала) JSON  - для генерации json-а используйте конструктор https://eb.nadeko.bot/ , сами не пишите`,
      `|pref|cities clear - очистить массив слов`,
      `|pref|cities addtWords JSON  - добавить массив слов`,
      `|pref|level level @упоминание  - установить уровень пользователю`,
      `|pref|levelingRoles add [Имя роли] уровень  - добавить роль`,
      `|pref|levelingRoles remove [Имя роли]  - убрать роль
	Пример: |pref|levelingRoles add Нолайфер  34`,
    ],
  },
  {
    title: 'Настройки',
    rows: [
      '|pref|server - узнать основную информацию и текущие настройки сервера',
      '|pref|prefix prefix  - изменить префикс',
      '|pref|logChannel set/clear  id/упоминание  - установить/убрать канал для логов',
      '|pref|baseRole set/clear  id/упоминание  - установить/убрать роль, которая выдаётся всем приходящим',
      '|pref|ideaChannel set/clear  id/упоминание  - установить/убрать канал для идей',
      '|pref|bankruptRole set/clear  id/упоминание  - установить/убрать роль для тех, кто не выплатил кредит, без неё не работает банк',
      '|pref|greetingChannel set/clear  id/упоминание  - установить/убрать канал для приветствия новых учасников',
      '|pref|blacklist add/remove  [id/упоминание]... - добавить/удалить людей(человека), которых будет игнорировать бот',
      '|pref|imageChannels add/remove  [id/упоминание]... - добавить/удалить кланал(ы), в которых будут выдаваться деньши за картинки(например канал с мемами)',
      '|pref|noCommandsChannels add/remove [id/упоминание]... - добавить/удалить кланал(ы), в котором(ых) бот будет игнорировать *комманды*',
      '|pref|wordsGameChannels add/remove [id/упоминание]... - добавить/удалить кланал(ы), в которых будет проводится игра в слова',
    ],
  },
]

module.exports.run = async (message, [page]) => {
  const { prefix } = await Guild.findOne({ id: message.guild.id })
  const embeds = pages.map(({ title, rows }) => {
    return new EmbedInstance({ title, prefix, rows, icon: message.guild.iconURL() })
  })
  slider(embeds, message, page)
}

module.exports.help = {
  name: 'help',
  aliases: ['h'],
}
