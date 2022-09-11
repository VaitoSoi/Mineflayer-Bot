module.exports = {
    name: 'edit',
    description: 'Chỉnh sửa config',
    aliases: ['e', 'set'],
    usage: '',
    run: async (args) => {
        const fs = require('fs-extra')
        const prompt = require('prompt')
        console.log('[Config] Đang chỉnh sửa config')
        console.log("[Config] Nhấn 'Enter' để bỏ qua")
        prompt.start()
        prompt.get({
            properties: {
                name: {
                    description: 'Tên của Config',
                    type: 'string',
                    pattern: /^\w+\S$/,
                    message: 'Tên phải chứa ít nhất 1 chữ và không có khoảng cách',
                    default: args[1]
                },
                owner: {
                    description: 'Tên của Owner',
                    type: 'string',
                    pattern: /^\w+\S$/,
                    message: 'Tên phải chứa ít nhất 1 chữ và không có khoảng cách',
                    default: 'players'
                },
                username: {
                    description: 'Tên của Bot',
                    type: 'string',
                    pattern: /^\w+\S$/,
                    message: 'Tên phải chứa ít nhất 1 chữ và không có khoảng cách',
                    default: 'players'
                },
                pin: {
                    description: 'Pin của Bot',
                    type: 'string',
                    pattern: /^[0-9] [0-9] [0-9] [0-9]$/,
                    message: 'Pin chỉ chứa 4 chữ số và có khoảng cách giữa mỗi chữ số',
                    default: '1 1 1 1'
                },
                ip: {
                    description: 'IP của server',
                    type: 'string',
                    pattern: /^\w+\S.+$/,
                    message: 'IP phải chứa ít nhất 1 chữ và không có khoảng cách',
                    default: 'anarchyvn.net'
                },
                port: {
                    description: 'Port của server',
                    type: 'string',
                    default: '25565'
                },
                version: {
                    description: 'Phiên bản của server',
                    type: 'string',
                    default: '1.12.2'
                },
                prefix: {
                    description: 'Prefix của Bot',
                    type: 'string',
                    pattern: /^\S$/,
                    message: 'Prefix phải chứa ít nhất 1 chữ và không có khoảng cách',
                    default: '!'
                },
                spam_chat: {
                    description: 'Các chat để cho bot spam',
                    type: 'string',
                    pattern: /\w+/,
                    message: 'Chat phải chứa ít nhất 1 chữ',
                    default: 'Create by VaitoSoi#2220'
                }
            }
        }).then(async (res) => {
            const ascii = require('ascii-table')
            const table = new ascii('Config')
            const file = require('edit-json-file')('./configs/' + args[1])
            const fs = require('fs-extra')
            const color = require('../../modules/color').code
            Object.keys(res).forEach(key => {
                let value = key != 'spam_chat' ? `${res[key]}` : [`${res[key]}`]
                file.set(key, value)
                table.addRow(key, res[key])
            })
            file.save()
            if (res.name != args[1]) {
                if (fs.existsSync(res.name)) {
                    console.error(color.red, `[Config] Config '${res.name}' đã tồn tại`)
                    res.name = args[1]
                }
                else fs.renameSync(`./configs/${args[1]}`, `./configs/${res.name}`)
            }
            console.log(`[Config] Đã chỉnh sửa config '${res.name}'`)
            console.log('[Config] ' + table.toString().split('\n').join('\n[Config] '))
        })
    }
}