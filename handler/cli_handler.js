const fs = require('node:fs')

/**
 * Command handler
 * @param {Array} array 
 */
module.exports = (array) => {
    fs.readdirSync('./cli/').filter(file => file.endsWith('.js')).forEach(file => {
        let command = require(`../cli/${file}`)
        if (!command.name) return console.error(`command file './cli/${file}' missing name`)
        if (!command.run) return console.error(`command file './cli/${file}' missing run function`)
        array.push({
            name: command.name ? command.name : 'Ủa sao có lệnh này hay vậy :)?',
            description: command.description ? command.description : 'Không có mô tả',
            usage: command.usage ? command.usage : '',
            aliases: command.aliases && Array.isArray(command.aliases) ? command.aliases : [],
            run: command.run
        })
    })
}
