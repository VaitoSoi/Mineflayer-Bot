const mineflayer = require('mineflayer')
const fs = require('node:fs')

/**
 * 
 * @param {mineflayer.Bot} bot 
 */
module.exports = (bot) => {
    fs.readdirSync('./events/').filter(file => file.endsWith).forEach(file => {
        const event = require(`../events/${file}`)
        if (!event.name) throw new Error(`event file './events/${file}' missing name`)
        if (!event.run) throw new Error(`event file './commands/${file}' missing run function`)
        if (!event.rl) bot.on(event.name, (...args) => event.run(bot, ...args))
        else bot.rl.on(event.name, (...args) => event.run(bot, ...args))
    })
}