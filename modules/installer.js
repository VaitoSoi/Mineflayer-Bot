const child_process = require('node:child_process')
const fs = require('fs')
let global_y = 0

const install_package = (package) => new Promise((resolve, reject) =>
    child_process.exec(`npm install ${package}`, async (err, output) =>
        err ? reject(err) : resolve(output)
    ))

const check = async () => {
    const axios = require('axios').default
    const res = await axios.get('https://api.github.com/repos/vaitosoi/mineflayer-bot/releases/latest')
    const old_version = require('./package.json').version
    return { check: res.data.tag_name == old_version, version: String(res.data.tag_name), full: res.data }
}

async function run() {
    console.clear()
    console.log('[Installer] Đang tải các gói tài nguyên...');
    const packages = (fs.readFileSync('./package.txt') + '')
        .split('\n')
        .map(str => str.replace('^', '@'))
    let i = 0, y = global_y
    console.log(
        '[----------------------------------------] 0 %\n' +
        packages.map(str => `> [ Pending ] ${str}`).join('\n')
    )
    y += 1
    for await (let package of packages) {
        let err = ''
        await install_package(package).catch(() => err = true)
        //await require('node:timers/promises').setTimeout(1000)
        i++; y++
        let proc = ''
        for (let y = 0; y < (i / packages.length) * 40; y++) proc += '#'
        for (let y = 0; y < 40 - (i / packages.length) * 40; y++) proc += '-'
        process.stdout.cursorTo(0, y)
        process.stdout.clearLine(0)
        process.stdout.write(`> [ ${err == true ? ' Error ' : ' Done '} ] ${package}`)
        process.stdout.cursorTo(0, 1)
        process.stdout.clearLine(0)
        process.stdout.write(`[${proc}] ${(i / packages.length * 100).toFixed(0)} %`)
        process.stdout.cursorTo(0, y + packages.length - packages.indexOf(package))
    }
    await require('node:timers/promises').setTimeout(1000)
    for (let i = 0; i < packages.length + 3; i++) {
        process.stdout.cursorTo(0, i)
        process.stdout.clearLine(0)
    }
    process.stdout.cursorTo(0, 0)
    process.stdout.clearLine(0)
    console.log('[Installer] Đã tải toàn bộ các gói tài nguyên')
    global_y++
    const update = await check()
    return download(update.version)
}

/**
 * @param {String} verison
 */
function download(version) {
    const superagent = require('superagent')
    process.stdout.write(`[Installer] Đang tải bản tải xuống mới nhất (${version})...`)
    superagent.get(`https://api.github.com/repos/VaitoSoi/Mineflayer-Bot/zipball/${version}`)
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36')
        .end(async (err, res) => {
            process.stdout.cursorTo(0, global_y)
            process.stdout.clearLine(0)
            if (err) return process.stdout.write(`[Installer] Lỗi ${err}\n`)
            fs.writeFileSync(`./update.zip`, res.body)
            console.log(`[Installer] Đã tải xong file nén của bản tải xuống mới`)
            global_y++
            return unzip()
        })
}

async function unzip() {
    const unzipper = require('unzipper')
    const fs = require('fs-extra')
    process.stdout.write('[Installer] Đang giải nén file...')
    //fs.copyFileSync('./package.json', './package-old.json')
    await (async () =>
        new Promise((resolve, reject) =>
            void fs.createReadStream('./update.zip')
                .pipe(unzipper.Extract({ path: './' }))
                .on('close', () => { console.log('done'); return resolve() })
            //.on('error', (err) => reject(err))
        )
    )().then(async () => {
        process.stdout.cursorTo(0, global_y)
        process.stdout.clearLine(0)
        const file = fs.readdirSync('./').filter((file) => /^VaitoSoi-Mineflayer-Bot-(.+)$/.test(file))
        await fs.copy(`./${file[0]}`, './', { overwrite: true })
        fs.removeSync(`./${file[0]}`)
        fs.removeSync('./update.zip')
        console.log('[Installer] Đã giải nén file')
        global_y++
        return install()
    })
}

async function install() {
    //console.clear()
    process.stdout.cursorTo(0, global_y)
    console.log('[Installer] Đang tải các gói tài nguyên...');
    global_y++
    const dependencies = require('./package.json').dependencies
    const packages = Object.keys(dependencies)
        .map(str => `${str}@${dependencies[str].replace('^', '')}`)
    let i = 0, y = global_y
    console.log(
        '[----------------------------------------] 0 %\n' +
        packages.map(str => `> [ Pending ] ${str}`).join('\n')
    )
    for await (let package of packages) {
        let err = ''
        await install_package(package).catch(() => err = true)
        //await require('node:timers/promises').setTimeout(1000)
        i++; y++
        let proc = ''
        for (let y = 0; y < (i / packages.length) * 40; y++) proc += '#'
        for (let y = 0; y < 40 - (i / packages.length) * 40; y++) proc += '-'
        process.stdout.cursorTo(0, y)
        process.stdout.clearLine(0)
        process.stdout.write(`> [ ${err == true ? ' Error ' : ' Done '} ] ${package} ${y}`)
        process.stdout.cursorTo(0, global_y)
        process.stdout.clearLine(0)
        process.stdout.write(`[${proc}] ${(i / packages.length * 100).toFixed(0)} %`)
        process.stdout.cursorTo(0, y + packages.length - packages.indexOf(package))
    }
    for (let i = global_y; i < global_y + y + 2; i++) {
        process.stdout.cursorTo(0, i)
        process.stdout.clearLine(0)
    }
    process.stdout.cursorTo(0, global_y)
    process.stdout.clearLine(0)
    console.log('[Installer] Đã tải toàn bộ các gói tài nguyên')
    global_y++
    console.log('[Installer] Đã tải toàn bộ bot.')
    console.log('[Installer] Vui lòng khởi động lại bot sau 5s.')
    setTimeout(() => process.exit(0), 5000)
}

async function prepair() {
    process.stdout.write('[Installer] Đang kiểm tra các yêu cầu...')
    if (Number(/^(.+)..(.+).(.+)$/.exec(process.version)[1]) < 16) {
        process.stdout.clearLine(0)
        process.stdout.cursorTo(0, 0)
        console.log('[Installer] Phiên bản NodeJS không hợp lệ')
        console.log('[Installer] Vui lòng tải NodeJS v16 trở đi.')
        return setTimeout(() => process.exit(0), 2500)
    } else {
        require('dns').resolve('www.google.com', function (err) {
            if (err) {
                process.stdout.clearLine(0)
                process.stdout.cursorTo(0, 0)
                console.log('[Installer] Không có kết nối internet')
                console.log('[Installer] Vui lòng kiểm tra lại kết nối mạng')
                setTimeout(() => process.exit(0), 2500)
            } else {
                process.stdout.clearLine(0)
                process.stdout.cursorTo(0, 0)
                console.log('[Installer] Hoàn thành việc kiểm tra')
                return run()
            }
        })
    }
}

prepair()