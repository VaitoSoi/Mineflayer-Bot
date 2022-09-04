const child_process = require('node:child_process')
const color = require('./color')

module.exports = () => {
    console.log(color.code.yellow, '[Console] Đang tải các gói tài nguyên...');

    const packages = require('../package.json').dependencies
    let dependencies = Object.keys(packages).map(str => `${str}${packages[str]}`)
    let i = 0
    let install = (package) => {
        child_process.exec(`npm install ${package}`, async (err) => {
            if (err) {
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
                console.error(color.code.red, `[Console] ${err}`);
                i++
                log();
            } else { i++; log() }
        })
    }
    let log = async () => {
        if (i < dependencies.length) {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            let name = dependencies[i].slice(0, dependencies[i].split('').indexOf('^'))
            let version = dependencies[i].slice(dependencies[i].split('').indexOf('^') + 1)
            process.stdout.write(`${color.code.blue, `[Console] [${Math.floor(i / (dependencies.length) * 100)}%]`} Đang tải gói '${name}' (ver ${version})...`);
            install(`${name}@${version}`)
        } else {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            console.log(color.code.green, '[Console] [100%] Đã tải toàn bộ gói tài nguyên')
            console.log('[Console] Đang tạo dữ liệu mới')
            require('./new-data')()
        }
    }
    log()
}