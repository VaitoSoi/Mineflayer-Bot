const mineflayer = require('mineflayer')
const color = require('../modules/color').code
const wait = require('node:timers/promises').setTimeout

module.exports = {
    name: 'message',
    /**
     * @param {mineflayer.Bot} bot 
     * @param {String} message 
     */
    async run (bot, message) {
        console.log(`[Livechat] ${message.toAnsi()}`)
        if (message.toString() == ' dùng lệnh/anarchyvn  để vào server.') {
            await wait(1000)
            bot.chat('/anarchyvn')
            console.log(color.green, "[Console] Đã nhập '/anarchyvn'")
        }
    }
}