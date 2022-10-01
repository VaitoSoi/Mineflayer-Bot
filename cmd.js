const color = require('./modules/color').code
let cmds = []
let readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
function run() {
    readline.once('line', async (input) => {
        if (!input) return
        let args = input.split(' ')
        const cmd = cmds.find(cmd => cmd.name == args[0].toLowerCase())
            || cmds.find(cmd => cmd.aliases.includes(args[0].toLowerCase()))
        if (!cmd) {
            console.error(color.red, `[Lỗi] Không thể tìm thấy lệnh '${input}'`)
            return process.stdout.write('command: ')
        }
        else {
            console.log('')
            await cmd.run(args, cmds).catch(e =>
                console.error(color.red, `[Lỗi] Gặp lỗi khi chạy lệnh '${input}'\n` +
                    `[Lỗi] ${e}`)
            )
            console.log('')
        }
        if (cmd.name != 'run') {
            process.stdout.write('command: ')
            run()
        }
    })
}

function start() {
    require('./handler/cli_handler')(cmds)
    console.log('----- Chào mừng bạn đã đến với bản điều khiển của Mineflayer-Bot ----')
    console.log('Bạn có thể gõ:\n' +
        `> help: để biết danh sách lệnh\n` +
        `> help <tên-lệnh>: để biết thông tin chi tiết về một lệnh\n` +
        `> run: để chạy bot\n` +
        `> config help create: để biết làm thế nào để tạo config\n`)
    process.stdout.write('command: ')
    run()
}
//start()
module.exports = start