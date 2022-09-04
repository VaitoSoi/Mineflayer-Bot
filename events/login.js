const mineflayer = require('mineflayer')
const color = require('../modules/color').code

module.exports = {
    name: 'login',
    /**
     * @param {mineflayer.Bot} bot 
     * @param {String} reason 
     */
    async run(bot) {
        bot.login++
        bot.joinAt = Date.now()
        bot.anti_bot = false
        if (bot.login > 2) bot.login = 1
        let switches = bot.login
        let server = ''

        // Phân loại các cụm (Pin, Queue, Main)
        if (switches == 1) server = 'PIN'
        else if (switches == 2) {
            server = 'MAIN';
            switches = 0;
            setTimeout(() => {
                bot.afk.start()
                console.log('[Console] Bot bắt đầu afk')
            }, 5 * 1000)
        }

        // Thông báo ra console
        console.log(color.green, '[Console] Đã kết nối đến server: ' + bot.config.ip)
        console.log(color.blue, '[Console] Hiện đang ở cụm sever: ' + server)
    }
}