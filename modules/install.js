const child_process = require('node:child_process')
const color = require('./color')
const readline = require('readline')

let run = () => {
    console.log(color.code.yellow, '[Console] Đang tải các gói tài nguyên...');
    const fs = require('fs')
    const exist = fs.existsSync('./package.json')
    const packages = exist == true
        ? require('../package.json').dependencies
        : (fs.readFileSync('./modules/package.txt') + '').split('\n')
    let dependencies = exist == true
        ? Object.keys(packages).map(str => `${str}${packages[str]}`)
        : packages
    let i = 0
    let install = (package) => {
        child_process.exec(`npm install ${package}`, async (err) => {
            if (err) {
                readline.clearLine(process.stdout)
                readline.cursorTo(process.stdout, 0)
                console.error(color.code.red, `[Console] ${err}`);
                i++
                log();
            } else { i++; log() }
        })
    }
    let log = async () => {
        if (i < dependencies.length) {
            let name = dependencies[i].slice(0, dependencies[i].split('').indexOf('^'))
            let version = dependencies[i].slice(dependencies[i].split('').indexOf('^') + 1)
            readline.clearLine(process.stdout)
            readline.cursorTo(process.stdout, 0)
            process.stdout.write(`${color.code.blue, `[Console] [${Math.floor(i / (dependencies.length) * 100)}%]`} Đang tải gói '${name}' (ver ${version})...`);
            install(`${name}@${version}`)
        } else {
            readline.clearLine(process.stdout)
            readline.cursorTo(process.stdout, 0)
            console.log(color.code.green, '[Console] [100%] Đã tải toàn bộ gói tài nguyên')
            require('./update').confirm(true)
        }
    }
    log()
}

//run()
module.exports = run