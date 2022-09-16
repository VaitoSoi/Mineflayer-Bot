/**
 * 
 *               Minefalyer-Bot
 * Vui lòng ghi Credit (VaitoSoi#2220) nếu có sử dụng
 * 
 * Có sử dụng code '2Y2C-Login-API' bởi MoonU#0001
 * Link dẫn vào bản gốc: https://github.com/MoonVN571/2Y2C-Login-API
 * 
 */

const fs = require('fs')

async function run() {
    const dir = fs.readdirSync('./')
    const update = require('./modules/update')
    if (await update.check() == false) return update.confirm(false)
    else {
        console.log('----- Chào mừng bạn đã đến với bản điều khiển của Mineflayer-Bot ----')
        console.log('Bạn có thể gõ:\n' +
            `> help: để biết danh sách lệnh\n` +
            `> help <tên-lệnh>: để biết thông tin chi tiết về một lệnh\n` +
            `> run: để chạy bot\n` +
            `> config guide: để biết làm thế nào để tạo config\n`)
        process.stdout.write('command: ')
        require('./cmd')()
    }
}

function start() {
    console.clear()
    console.log(
        `.-------------------------------------------------------------------.\n` +
        `|                        __   __                        __   __     |\n` +
        `|  ||\\\\//|| || ||\\\\ || ||   ||   ||     //\\\\   \\\\  // ||   ||  ||   |\n` +
        `|  ||    || || || \\\\|| ||== ||== ||    //==\\\\   \\\\//  ||== || //    |\n` +
        `|  ||    || || ||   || ||__ ||   ||__ //    \\\\   ||   ||__ ||  \\\\   |\n` +
        `|                         __     __   ______                        |\n` +
        `|                       ||  || ||  ||   ||                          |\n` +
        `|                       ||=<<  ||  ||   ||                          |\n` +
        `|                       ||__|| ||__||   ||                          |\n` +
        `|                                                                   |\n` +
        `|                    Tạo ra bởi: 'VaitoSoi#2220'                    |\n` +
        `|              Giấy phép: 'GNU General Public License v3'           |\n` +
        `'-------------------------------------------------------------------'\n`
    )
    run()
}

start()