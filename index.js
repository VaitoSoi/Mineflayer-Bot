/**
 * 
 *                          Login-2y2c-Example
 * Vui lòng ghi Credit (bao gồm: 'MoonU#0001' và 'VaitoSoi#2220') nếu có sử dụng
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
const info = require('./config.json')   // Khai báo thông tin, vui lòng chỉnh sửa như bên dưới

/**
 * Vào file 'config.json'.
 * Chỉnh sửa các mục như dưới:
 *  +  username (là tên của của tài khoản Minecraft của bot)
 *  +  pass (là mật khẩu để đăng nhập vào tài khoản của bot khi tham gia vào sever 2y2c.org)
 * Có thể chỉnh (muốn chỉnh hay không thì bạn): 
 *  +  ip (IP của sever, mặc định là 2y2c.org)
 *  +  version (phiên bản của Minecraft khi tham gia vào server)
 *  +  port (là cổng để tham gia vào server, mặc định là 25565)
 * 
 * !!Lưu ý:
 *  **  username không được có dấu cách (vd: OggyTheBot)
 *  **  pass phải viết tách từng con số ra (vd: 1 2 3 4)
 *  -  ip server phải là 1 ip hợp lệ/có tồn tại (vd: 2y2c.org)
 *  -  version phải là 1 phiên bản hợp lệ/có tồn tại (vd: 1.17.1)
 *  -  port phải là 1 cổng hợp lệ (vd: 25565)
 */

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
        host: info.ip,

        // Port của server
        port: Number(info.port),

        // Plugin AFK
        plugins: {
            afk: require('./afk')
        }
    })
    let enter = false

    // Khi có 1 cửa sổ (bàn chế tạo, rương, lò nung,v.v...) mở
    bot.on('windowOpen', async (window) => {

        // Nếu cửa sổ đó là rương đơn (thường cộng với Inventory và Hotbar là 63)
        if (Number(window.slots.length) == 63) {

            // Thông báo ra console
            console.log('[CONSOLE]» 🟢 | Cửa sổ CHUYỂN-SERVER mở. ')

            // Nhấn vào ô để chuyển server
            bot.simpleClick.leftMouse(10);

            // Thông báo ra console
            console.log('[CONSOLE]» 🟢 | Đã click vào ô CHUYỂN-SERVER.')

            // Nếu cửa sổ đó là bàn chế tạo (thường cộng với Inventory và Hotbar là 46) 
        } else if (Number(window.slots.length) == 46) {

            // Thông báo ra console
            console.log('[CONSOLE]» 🟢 | Cửa sổ NHẬP-PIN mở. ')

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

            // Thay đổi giá trị biến
            enter = true
        }
    });

    // Thông báo ra console khi có tin nhắn
    bot.on('messagestr', (msg) => {
        console.log('[LIVECHAT]» ' + msg)
        if (enter = true && msg === ' dùng lệnh/2y2c  để vào server.') {
            bot.chat('/2y2c')
            console.log('[CONSOLE]» 🟢 | Đã nhập /2y2c')
        } else if (msg === 'The main server is down. We will be back soon!') bot.end('Sever restart')
    })

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
        else if (switches == 3) {
            server = 'MAIN';
            switches = 0;
            setTimeout(() => {
                bot.afk.start()
                console.log('[CONSOLE]» 🟢 | Bot bắt đầu afk')
            }, 5 * 1000)
        }

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