const color = require('./modules/color').code
let cmds = []
let readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
function run() {
    readline.on('line', async (input) => {
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
        if (cmd.name == 'run') readline.close()
        else process.stdout.write('command: ')
    })
}

function start() {
    require('./handler/cli_handler')(cmds)
    run()
}
//start()
module.exports = start