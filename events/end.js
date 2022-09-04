const mineflayer = require('mineflayer')
const color = require('../modules/color').code
const ms = require('ms')

module.exports = {
    name: 'end',
    /**
     * @param {mineflayer.Bot} bot 
     * @param {String} reason 
     */
    async run(bot, reason) {
        bot.login = 0
        let time = '5m'
        if (reason == 'socketClosed') time = '1m'

        console.log(color.red, '[Console] Bot mất kết nối với sevrer: ' + bot.config.ip)
        console.log(color.red, '[Console] Với lý do: ' + reason.toString())
        console.log(color.red, '[Console] Kết nối lại sau 5 phút.')

        if (bot.anti_bot == false) bot.reconnect = setTimeout(() => {
            console.log(color.yellow, '[Console] Đang kết nối lại với server: ' + bot.config.ip)
            require('../index')
        }, ms(time))
    }
}