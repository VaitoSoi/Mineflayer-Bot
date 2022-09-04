const mineflayer = require('mineflayer')

module.exports = {
    name: 'chat',
    /**
     * @param {mineflayer.Bot} bot 
     * @param {String} username 
     * @param {String} message 
     */
    async run(bot, username, message) {
        let args = message.split(' ')
        if (args[0] == '>') args.slice(1)
        if (args[0] == bot.player.username)
            return bot.chat(`/w ${username} Prefix là: ${bot.config.prefix} | Dùng lệnh ${bot.config.prefix}help để biết danh sách lệnh`)
        if (!args[0].startsWith(bot.config.prefix)) return
        args[0] = args[0].slice(bot.config.prefix.length)
        const cmd = bot.cmds.find(cmd => cmd.name == args[0].toLowerCase())
                || bot.cmds.find(cmd => cmd.aliases.includes(args[0].toLowerCase()))
        if (!cmd) return bot.chat(`/w ${username} Không tìm thấy lệnh ${args[0]}`)
        args = [username, ...args]
        cmd.run(bot, args)
    }
}