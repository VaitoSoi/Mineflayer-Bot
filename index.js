const fs = require('fs')

async function run() {
    if (!fs.readdirSync('./').includes('node_modules')) {
        console.log('[Console] Có vẻ đây là lần đầu bạn dùng Mineflayer-Bot')
        await require('./modules/install')()
    } else {
        console.log('[Console] Đang khởi động bot...')
        require('./run')()
    }
}

run()