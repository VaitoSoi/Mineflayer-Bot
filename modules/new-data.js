const prompt = require('prompt')
const fs = require('fs-extra')

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
                pattern: /\w+/,
                message: 'Chat phải chứa ít nhất 1 chữ',
                default: 'Create by VaitoSoi#2220'
            }
        }
    }).then(async (res) => {
        const ascii = require('ascii-table')
        const table = new ascii('Config')
        const file = require('edit-json-file')('./configs/default.json')
        Object.keys(res).forEach(key => {
            let value = key != 'spam_chat' ? `${res[key]}` : [`${res[key]}`]
            file.set(key, value)
            table.addRow(key, res[key])
        })
        file.save()
        if (!fs.readdirSync('./').includes('configs')) fs.mkdirSync('./configs')
        fs.copyFileSync('./configs/default.json', './config.json')
        require('edit-json-file')('./config.json', { autosave: true }).set('name', 'default')
        console.log('[Console] Đã tạo file data mới')
        console.log('[Console] ' + table.toString().split('\n').join('\n[Console] '))
        require('../index')
    })
}

//run()
module.exports = run