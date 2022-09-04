const fs = require('node:fs')

/**
 * Command handler
 * @param {Array} array 
 */
module.exports = (array) => {
    fs.readdirSync('./commands/').filter(file => file.endsWith('.js')).forEach(file => {
        let command = require(`../commands/${file}`)
        if (!command.name) return console.error(`command file './commands/${file}' missing name`)
        if (!command.run) return console.error(`command file './commands/${file}' missing run function`)
        array.push({
            name: command.name,
            description: command.description ? command.description : 'Không có mô tả',
            usage: command.usage ? command.description : '',
            aliases: command.aliases && Array.isArray(command.aliases) ? command.aliases : [],
            run: command.run
        })
    })
}
