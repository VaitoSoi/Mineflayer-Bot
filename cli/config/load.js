module.exports = {
    name: 'load',
    description: 'Tải một config',
    aliases: ['l'],
    usage: '',
    run: async (args) => {
        const fs = require('fs-extra')
        fs.copyFileSync(`./configs/${args[2]}.json`, `./config.json`)
        const file = require('edit-json-file')('./config.json', { autosave: true })
        file.set('name', args[2])
        delete require.cache[require.resolve('../../config.json')]
        console.log('[Config] Đã load config')
    }
}