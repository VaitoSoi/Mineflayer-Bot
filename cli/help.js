const color = require('../modules/color').code

module.exports = {
    name: 'help',
    description: 'Hiện thông tin của 1 hoặc toàn bộ lệnh',
    aliases: ['h', 'sos'],
    usage: '(tên-lệnh)',
    /**
     * @param {String[]} args 
     * @param {Array} cmds
     */
    run: async (args, cmds) => {
        if (!args[1]) {
            console.log(
                'Các lệnh hiện có: \n' +
                cmds.map(cmd => ` | ${cmd.name} - ${cmd.description}`).join('\n') + '\n' +
                '\n' +
                'Hỗ trợ\n' +
                ' | Discord: VaitoSoi#2220'
            )
        } else {
            const cmd = cmds.find(cmd => cmd.name == args[1].toLowerCase())
                || cmds.find(cmd => cmd.aliases.includes(args[1].toLowerCase()))
            if (!cmd) return console.error(color.red, `[Lỗi] Không tìm thấy lệnh ${args[1]}`)
            console.log(
                `Thông tin về lệnh ${args[1]}\n` +
                ` | Tên: ${cmd.name}\n` +
                ` | Tên khác: ${cmd.aliases.length != 0 ? cmd.aliases.join(', ') : 'Không có tên khác :c'}\n` +
                ` | Mô tả: ${cmd.description}\n` +
                ` | Cách dùng: ${cmd.usage != '' ? `${cmd.name} ${cmd.usage}` : 'Không có hướng dẫn sử dụng :c'}\n` +
                ` <>: bắt buộc phải có | (): không cần thiết phải có`
            )
        }
    }
}