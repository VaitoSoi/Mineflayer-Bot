const color = require('../../modules/color').code

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
        if (!args[2]) {
            console.log(
                'Các key hiện có: \n' +
                cmds.map(cmd => ` | ${cmd.name} - ${cmd.description}`).join('\n') + '\n' +
                '\n' +
                'Cách dùng: config <key> <tên config> ...'
            )
        } else {
            const cmd = cmds.find(cmd => cmd.name == args[2].toLowerCase())
                || cmds.find(cmd => cmd.aliases.includes(args[2].toLowerCase()))
            if (!cmd) return console.error(color.red, `[Lỗi] Không tìm thấy lệnh ${args[2]}`)
            console.log(
                `Thông tin về key ${args[2]}\n` +
                ` | Tên: ${cmd.name}\n` +
                ` | Tên khác: ${cmd.aliases.length != 0 ? cmd.aliases.join(', ') : 'Không có tên khác :c'}\n` +
                ` | Mô tả: ${cmd.description}\n` +
                ` | Cách dùng: ${cmd.usage != '' ? `config ${cmd.name} <tên config> ${cmd.usage}` : `config ${cmd.name} <tên config>`}\n` +
                ` <>: bắt buộc phải có | (): không cần thiết phải có`
            )
        }
    }
}