const mineflayer = require('mineflayer')
const wait = require('node:timers/promises').setTimeout
const file = require('edit-json-file')('./config.json')

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
            bot.chat(`/w ${args[0]} Vui lòng cho 1 tin nhắn hợp lệ`)
        else {
            file.append('spam', args[2])
        }
    }
}