const { Bot } = require('mineflayer')
const color = require('../modules/color')

module.exports = {
    name: 'kicked',
    /**
     * 
     * @param {Bot} bot 
     * @param {String} reason 
     * @param {Boolean} login 
     */
    async run(bot, reason, login) {
        const flame_cord_1 = /^kết nối lại (.+) để vào server$/
        const chat = /^you are chatting too fast!$/
        let obj = JSON.parse(reason.toString())
        //console.log(obj)
        if (obj.extra) {
            /**
             * @param {Array} array 
             */
            let show = async (array) => {
                let str = ''
                array.forEach(async e => {
                    if (e.extra && e.extra.length != 0) str = await show(e.extra)
                    else if (!e.text) return
                    else e.text.split('\n').forEach(text => {
                        if (flame_cord_1.test(text.toString().toLowerCase())
                            || chat.test(text.toString().toLowerCase())) return str = 'Anti-Bot'
                        else if (text.trim() != '' && str.toLowerCase() != 'anti-bot') str += `${text}\n`
                    })
                })
                return str
            }
            let reas = obj.text != '' ? obj.text.replace('§', '') : await show(obj.extra)
            console.log(color.code.red,
                '[Console] Bot bị kick ra khỏi server\n' +
                `[Console] Lý do: ${reas}`)
            if (reas.toLowerCase() == 'anti-bot') {
                clearTimeout(bot.reconnect)
                bot.anti_bot = true
                bot.reconnect = setTimeout(() => {
                    require('../run')()
                }, 5 * 1000);
            }
        } else {
            if (obj.text && obj.text.toLowerCase() == 'you are already connected to this proxy!') {
                if (bot.login == 0) clearTimeout(bot.reconnect)
            } else if (obj.text.split('\n').join(' ').trim() == '') return
            else console.log(color.code.red, '[Console] Bot bị kick ra khỏi server\n' +
                `[Console] Lý do: ${obj.text ? obj.text.toString() :
                    `${obj.translate == 'multiplayer.disconnect.kicked' ? 'Kick bởi Admin' : 'null'}` }`)
        }
    }
}