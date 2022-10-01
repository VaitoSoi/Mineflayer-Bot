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
    const confirm = require('./setting.json')['auto-update']
    console.log(check == false && connection == true && confirm == true)
    if (check == false && connection == true && confirm == true) return update.confirm()
    else {
        process.stdout.clearLine(0)
        process.stdout.cursorTo(0)
        require('./cmd')()
    }
}

const fs = require('fs-extra')
const dir = fs.readdirSync('./')
if (dir.includes('installer.js') ||
    dir.includes('window_install.bat') ||
    dir.includes('other_install.sh') ||
    dir.includes('package.txt'))
    [
        'installer.js',
        'window_install.bat',
        'other_install.sh',
        'package.txt'
    ].forEach(file => fs.readdirSync('./').includes(file)
        ? fs.rmSync(`./${file}`)
        : undefined)
if (!dir.includes('setting.json')) fs.writeFileSync('./setting.json', '{ "auto-update": true }')
if (!dir.includes('config.json')) return require('./modules/new-data')()
run()