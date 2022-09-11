module.exports = {
    name: 'config',
    aliases: ['setting'],
    description: 'Cài đặt bot',
    usage: '<key> <tên config> ...',
    /**
     * @param {String[]} args
     */
    run: async (args) => {
        const fs = require('fs-extra')
        const color = require('../modules/color').code
        const configs = await handler()
        const cmd = configs.find(config => config.name == args[1].toLowerCase())
            || configs.find(config => config.aliases.includes(args[1].toLowerCase()))
        if (!cmd) return console.error(color.red, `[Config] Không thể tìm thấy key '${args[1]}'`)
        if (!args[1].toLowerCase()) return console.error(color.red, "[Config] Thiếu key, dùng 'config help' để biết key là gì")
        if (!['list', 'help'].includes(cmd.name)
            && !args[2]) return console.error(color.red, "[Config] Thiếu tên config")
        if (['create'].includes(args[1].toLowerCase())
            && fs.existsSync(args[2] + '.json')) return console.error(`[Config] Config '${args[2]}' đã tồn tại`)
        else if (['edit', 'load', 'spam_chat'].includes(args[1].toLowerCase())
            && fs.existsSync(args[2] + '.json')) return console.error(`[Config] Config '${args[2]}' không tồn tại`)
        cmd.run(args, configs)
    }
}

let handler = async () => {
    let array = []
    const fs = require('fs-extra')
    await fs.readdirSync('./cli/config/').filter(file => file.endsWith('.js')).forEach(file => {
        let command = require(`../cli/config/${file}`)
        if (!command.name) return console.error(`command file './cli/config/${file}' missing name`)
        if (!command.run) return console.error(`command file './cli/config/${file}' missing run function`)
        array.push({
            name: command.name ? command.name : 'Ủa sao có lệnh này hay vậy :)?',
            description: command.description ? command.description : 'Không có mô tả',
            usage: command.usage ? command.usage : '',
            aliases: command.aliases && Array.isArray(command.aliases) ? command.aliases : [],
            run: command.run
        })
    })
    return array
}