module.exports = {
    name: 'setting',
    aliases: ['set'],
    usage: '<key: dev|auth|auto-update> <giá trị: true|false|string>',
    description: 'Chỉnh sửa cài đặt bot',
    run: async (args) => {
        const file = require('edit-json-file')('./setting.json', { autosave: true })
        switch (args[1]) {
            case 'dev':
            case 'auto-update':
                if (args[2] != 'true' && args[2] != 'false') return console.log('[Setting] Giá trị không hợp lệ')
                file.set(args[1], args[2] == 'true' ? true : false)
                console.log('[Setting] Đã chỉnh cài đặt')
                break
            case 'auth':
                file.set(args[1], args[2])
                console.log('[Setting] Đã chỉnh cài đặt')
                break;
            default: console.log('[Setting] Key không hợp lệ')
        }
    }
}