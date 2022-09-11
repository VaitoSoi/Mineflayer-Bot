module.exports = {
    name: 'spam_chat',
    description: 'Các spam chat',
    aliases: ['spam'],
    usage: '<+<chat>|-<chat>|?>',
    /**
     * @param {String[]} args
     */
    run: async (args) => {
        const file = require('edit-json-file')(`./configs/${args[2]}.json`, { autosave: true })
        const config = require(`../../configs/${args[2]}.json`)
        if (args[3].startsWith('+')) {
            const chat = args[2].slice(1)
            const color = require('../../modules/color').code
            if (chat.length > 150) return console.error(color.red, '[Config] Spam chat không dài quá 150 ký tự')
            file.append('spam_chat', chat)
            console.log(`[Config] Đã thêm spam chat '${args[2].slice(1)}'`)
        } else if (args[3].startsWith('-')) {
            const i = Number(args[2].slice(1))
            config.spam_chat.splice(i, 1)
            file.set('spam_chat', config.spam_chat)
            console.log(`[Config] Đã xóa spam chat ở vị trí '${i}'`)
            console.log(`[Config] Đã thay chat '${config.spam_chat[i]}' vào vị trí '${i}'`)
        } else if (args[3].startsWith('?')) {
            const ascii = require('ascii-table')
            const table = new ascii('Các spam chat hiện có')
            table.setHeading('Vị trí', 'Chat')
            for (let i = 0; i < config.spam_chat.length; i++)
                table.addRow(i, config.spam_chat[i])
            console.log(table.toString())
        } else {
            console.log(
                'Thiếu action\n' +
                '> +<chat>: để thêm spam chat\n' +
                '> -<vị trí>: xóa 1 chat tại vị trí chỉ định\n' +
                '> ?: để hiện bảng vị trí của các chat'
            )
        }
    }
}