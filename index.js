/*
.-------------------------------------------------------------------. 
|                        __   __                        __   __     | 
|  ||\\//|| || ||\\ || ||   ||   ||     //\\   \\  // ||   ||  ||   | 
|  ||    || || || \\|| ||== ||== ||    //==\\   \\//  ||== || //    | 
|  ||    || || ||   || ||__ ||   ||__ //    \\   ||   ||__ ||  \\   | 
|                         __     __   ______                        | 
|                       ||  || ||  ||   ||                          | 
|                       ||=<<  ||  ||   ||                          | 
|                       ||__|| ||__||   ||                          | 
|                                                                   | 
|                    Tạo ra bởi: 'VaitoSoi#2220'                    | 
|              Giấy phép: 'GNU General Public License v3'           | 
'-------------------------------------------------------------------'
*/
async function run() {
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
    process.stdout.write('[Auto-Update] Đang kiểm tra bản cập nhập mới...')
    const update = require('./modules/update')
    const check = (await update.check()).check
    const connection = await new Promise(async (resolve) =>
        require('node:dns').resolve('www.google.com', (err) =>
            err ? resolve(false) : resolve(true)
        )
    )
    if (check == false && connection == true) return update.confirm()
    else {
        process.stdout.clearLine(0)
        process.stdout.cursorTo(0)
        require('./cmd')()
    }
}

run()