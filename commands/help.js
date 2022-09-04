const mineflayer = require('mineflayer')
const wait = require('node:timers/promises').setTimeout

module.exports = {
    name: 'help',
    description: 'Hiện thông tin của 1 hoặc toàn bộ lệnh',
    aliases: ['h', 'sos'],
    usage: '(tên-lệnh)',
    /**
     * @param {mineflayer.Bot} bot 
     * @param {String[]} args 
     */
    run: async (bot, args) => {
        if (!args[2])
            bot.chat(`/w ${args[0]} Các lệnh hiện có: ${bot.cmds.map(cmd => cmd.name).join(', ')}`)
        else {
            const cmd = bot.cmds.find(cmd => cmd.name == args[2].toLowerCase())
                || bot.cmds.find(cmd => cmd.aliases.includes(args[2].toLowerCase()))
            if (!cmd) return bot.chat(`/w ${args[0]} Không tìm thấy lệnh ${args[2]}`)
            bot.chat(`/w ${args[0]} Tên: ${cmd.name}`)
            await wait(1000)
            bot.chat(`/w ${args[0]} Tên khác: ${cmd.aliases.join(', ')}`)
            await wait(1000)
            bot.chat(`/w ${args[0]} Mô tả: ${cmd.description}`)
            await wait(1000)
            bot.chat(`/w ${args[0]} Cách dùng: ${bot.config.prefix}${cmd.name} ${cmd.usage}`)
        }
    }
}