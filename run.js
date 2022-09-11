const mineflayer = require('mineflayer')
const info = require('./config.json')
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const prompt = require('prompt')
prompt.start()

async function run() {
    console.log('[Console] Đang khởi động bot...')

    const bot = mineflayer.createBot({
        username: info.username,
        version: info.version,
        host: info.ip,
        port: Number(info.port),
        plugins: {
            afk: require('./afk')
        }
    })

    bot.cmds = []
    bot.config = info
    bot.login = 0
    bot.readyAt = Math.floor(Date.now() /1000)
    bot.joinAt = 0
    bot.rl = rl
    bot.anti_bot = false

    require('./handler/mc_commands')(bot.cmds)
    require('./handler/mc_events')(bot)
}

module.exports = run