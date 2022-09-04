/**
 * 
 *               Minefalyer-Example-Bot
 * Vui lòng ghi Credit (VaitoSoi#2220) nếu có sử dụng
 * 
 * Có sử dụng code '2Y2C-Login-API' bởi MoonU#0001
 * Link dẫn vào bản gốc: https://github.com/MoonVN571/2Y2C-Login-API
 * 
 */

/**
 * 
 * Khai báo
 * 
 */

const mineflayer = require('mineflayer') // Khai báo mineflayer
const info = require('./config.json')   // Khai báo thông tin
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * 
 * Chương trình chính
 * 
 */

async function run() {
    // Khai báo bot
    const bot = mineflayer.createBot({
        // Tên của Bot
        username: info.username,

        // Version của game
        version: info.version,

        // IP của server
        host: info.ip,

        // Port của server
        port: Number(info.port),

        // Plugin AFK
        plugins: {
            afk: require('./afk')
        }
    })

    // Khai báo các biến cần thiết
    bot.cmds = []
    bot.config = info
    bot.login = 0
    bot.readyAt = Math.floor(Date.now() /1000)
    bot.joinAt = 0
    bot.rl = rl
    bot.anti_bot = false

    // Handler command và event
    require('./handler/commands')(bot.cmds)
    require('./handler/events')(bot)
}

module.exports = run