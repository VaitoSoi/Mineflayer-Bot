/**
 * 
 *                   Login-2y2c-Example
 * Vui lòng ghi credit (bao gồm: 'MoonU#0001' và 'VaitoSoi#2220')
 * 
 * Đây là 1 bản làm lại dựa trên '2Y2C-Login-API' của MoonU#0001
 * Link dẫn vào bản gốc: https://github.com/MoonVN571/2Y2C-Login-API
 * 
 */

/**
 * 
 * Khai báo
 * 
 */

const mineflayer = require('mineflayer') // Khai báo mineflayer
const info = require('./config.json')   // Khai báo thông tin, có thể dùng file .env để thay thế

/**
 * 
 * Khai báo chương trình
 * 
 */

function run() {
    
    // Khai báo bot
    const bot = mineflayer.createBot({ 
        // Tên của Bot
        username: info.username, 

        // Version của game
        version: info.version,  

        // IP của server
        host: info.ip          
    })

    // Khi có 1 cửa sổ (bàn chế tạo, rương, lò nung,v.v...) mở
    bot.on('windowOpen', async (window) => {

        // Nếu cửa sổ đó là rương đơn (thường cộng với Inventory và Hotbar là 63)
        if (Number(window.slots.length) == 63) {

            // Thông báo ra console
            console.log('\n[CONSOLE]» 🟢 | Cửa sổ CHUYỂN-SERVER mở. \n')

            // Nhấn vào ô để chuyển server
            bot.simpleClick.leftMouse(10);

            // Thông báo ra console
            console.log('\n[CONSOLE]» 🟢 | Đã click vào ô CHUYỂN-SERVER. \n')

            // Nếu cửa sổ đó là bàn chế tạo (thường cộng với Inventory và Hotbar là 46) 
        } else if (Number(window.slots.length) == 46) {

            // Thông báo ra console
            console.log('\n[CONSOLE]» 🟢 | Cửa sổ NHẬP-PIN mở. \n')

            // Khai báo PASSWORD
            const pass = info.pass.split(' ')

            const p1 = pass[0];
            const p2 = pass[1];
            const p3 = pass[2];
            const p4 = pass[3];

            // Nếu các mã không đáp ứng nhu cầu
            if (!p1 || isNaN(Number(p1))) console.log('[ERROR]» 🛑 | Vui lòng kiểm tra lại mật khẩu')
            if (!p2 || isNaN(Number(p2))) console.log('[ERROR]» 🛑 | Vui lòng kiểm tra lại mật khẩu')
            if (!p3 || isNaN(Number(p3))) console.log('[ERROR]» 🛑 | Vui lòng kiểm tra lại mật khẩu')
            if (!p4 || isNaN(Number(p4))) console.log('[ERROR]» 🛑 | Vui lòng kiểm tra lại mật khẩu')

            //Nhập PIN
            bot.simpleClick.leftMouse(Number(p1));
            bot.simpleClick.leftMouse(Number(p2));
            bot.simpleClick.leftMouse(Number(p3));
            bot.simpleClick.leftMouse(Number(p4));

            // Thông báo ra console
            console.log('[CONSOLE]» 🟢 | Đã nhập pin!')
        }
    });

    // Thông báo ra console khi có tin nhắn
    bot.on('messagestr', (msg) => console.log('[LIVECHAT]» ' + msg))

    // Khi bot ngắt kết nối đến server
    bot.on('end', (reason) => {
        // Thông báo tới console (làm màu thôi ;-;)
        console.log('[CONSOLE]» 🔴 | Bot mất kết nối với sevrer: ' + info.ip)
        console.log('[CONSOLE]» 🔴 | Với lý do: ' + reason.toString()) // Thông báo lý do
        console.log('[CONSOLE]» 🔴 | Kết nối lại sau 5 phút.')

        setTimeout(() => {
            console.log('[CONSOLE]» 🟡 | Đang kết nối lại với server: ' + info.ip)
            run()
        }, 5 * 60 * 1000)
    })

    let switches = 0

    // Khi bot logi vào sevrer
    bot.on('login', () => {
        switches++
        let sevrer = ''

        // Phân loại các cụm (Pin, Queue, Main)
        if (switches == 1) sevrer = 'PIN'
        else if (switches == 2) server = 'QUEUE'
        else if (switches == 3) { server = 'MAIN'; switches = 0 }

        // Thông báo ra console
        console.log('[CONSOLE]» 🟢 | Đã kết nối đến server: ' + info.ip)
        console.log('[CONSOLE]» 🟢 | Hiện đang ở cụm sever: ' + sevrer)
    })
}

/**
 * 
 * Chạy chương trình
 * 
 */

run()