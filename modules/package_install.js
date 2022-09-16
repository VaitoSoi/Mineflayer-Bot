function run() {
    console.log('[Installer] Đang tải các gói tài nguyên...');
    const child_process = require('node:child_process')
    const fs = require('fs')
    const readline = require('readline')
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    const exist = fs.existsSync('./package.json')
    const packages = exist == true
        ? require('../package.json').dependencies
        : (fs.readFileSync('./package.txt') + '').split('\n')
    let dependencies = exist == true
        ? Object.keys(packages).map(str => `${str}${packages[str]}`)
        : packages
    let i = 0
    let install = (package) => {
        child_process.exec(`npm install ${package}`, async (err) => {
            if (err) {
                clear_n_log(`[Installer] ${err}`, 1);
                i++
                log();
            } else { i++; log() }
        })
    }
    let log = async () => {
        if (i < dependencies.length) {
            let name = dependencies[i].slice(0, dependencies[i].split('').indexOf('^'))
            let version = dependencies[i].slice(dependencies[i].split('').indexOf('^') + 1)
            await readline.clearLine(process.stdout, 0)
            readline.cursorTo(process.stdout, 0, rl.rows)
            process.stdout.write(`${`[Installer] [${Math.floor(i / (dependencies.length) * 100)}%]`} Đang tải gói '${name}' (ver ${version})...`);
            install(`${name}@${version}`)
        } else {
            readline.clearLine(process.stdout)
            readline.cursorTo(process.stdout, 0)
            console.log('[Installer] [100%] Đã tải toàn bộ gói tài nguyên')
            const file = require('edit-json-file')('./package.json', { autosave: true })
            file.set('version', 'pre-install')
            require('./bot_install')
        }
    }
    log()
}

run()