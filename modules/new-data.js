const prompt = require('prompt')
const file = require('edit-json-file')('./config.json')

async function run() {
    console.log('[Console] Đang tạo dữ liệu mới')
    console.log("[Console] Nhấn 'Enter' để bỏ qua")
    prompt.start()
    prompt.get({
        properties: {
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
                pattern: /^\w+$/,
                message: 'Chat phải chứa ít nhất 1 chữ',
                default: 'Create by VaitoSoi#2220'
            }
        }
    }).then(async (res) => {
        const ascii = require('ascii-table')
        const table = new ascii('Config')
        Object.keys(res).forEach(key => {
            file.set(key, res[key])
            table.addRow(key, res[key])
        })
        file.save()
        console.log('[Console] Đã tạo file data mới')
        console.log('[Console] ' + table.toString().split('\n').join('\n[Console] '))
        require('../run')()
    })
}

module.exports = run()