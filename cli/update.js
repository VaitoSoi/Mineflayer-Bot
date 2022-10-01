module.exports = {
    name: 'update',
    aliases: [],
    description: 'Update Bot',
    run: async () => {
        const update = require('./modules/update')
        const check = (await update.check()).check
        const connection = await new Promise(async (resolve) =>
            require('node:dns').resolve('www.google.com', (err) =>
                err ? resolve(false) : resolve(true)
            )
        )
        if (check == false && connection == true) return update.confirm()
        else console.log('[Update] Không có bản cập nhật mới :c')
    }
}