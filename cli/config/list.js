module.exports = {
    name: 'list',
    description: 'Hiện danh sách các config',
    aliases: [''],
    usage: '',
    run: async (args) => {
        const fs = require('fs-extra')
        const color = require('../../modules/color').color
        const name = require('../../config.json').name
        const list = fs.readdirSync('./configs/')
            .filter(file => file.endsWith('.json'))
            .map(file => name == file.slice(0, -5) ? `${color.blue}${file}${color.reset} (đang dùng)` : file)
        console.log('[Config] Các configs hiện có:\n> ' + list.join('\n> '))
    }
}