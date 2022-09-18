const child_process = require('node:child_process')
const fs = require('fs')

const install_package = (package) => new Promise((resolve, reject) =>
    child_process.exec(`npm install ${package}`, async (err, output) =>
        err ? reject(err) : resolve(output)
    ))

const getCursorPos = () => new Promise((resolve) => {
    const termcodes = { cursorGetPosition: '\u001b[6n' };

    process.stdin.setEncoding('utf8');
    process.stdin.setRawMode(true);

    const readfx = function () {
        const buf = process.stdin.read();
        const str = JSON.stringify(buf); // "\u001b[9;1R"
        const regex = /\[(.*)/g;
        if (!regex.test(str)) return
        const xy = regex.exec(str)[0].replace(/\[|R"/g, '').split(';');
        const pos = { y: xy[0], x: xy[1] };
        process.stdin.setRawMode(false);
        resolve(pos);
    }

    process.stdin.once('readable', readfx);
    process.stdout.write(termcodes.cursorGetPosition);
})

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
    let i = 0;
    console.log(
        '[----------------------------------------] 0 %\n' +
        packages.map(str => `> [ Pending ] ${str}`).join('\n')
    )
    for await (let package of packages) {
        let err = ''
        await install_package(package).catch(() => err = true)
        //await require('node:timers/promises').setTimeout(1000)
        const pos = await getCursorPos()
        const y = pos.y - 1 - packages.length + packages.indexOf(package)
        let proc = ''
        i++
        for (let y = 0; y < (i / packages.length) * 40; y++) proc += '#'
        for (let y = 0; y < 40 - (i / packages.length) * 40; y++) proc += '-'
        process.stdout.cursorTo(0, Number(y))
        process.stdout.clearLine(0)
        process.stdout.write(`> [ ${err == true ? ' Error ' : ' Done '} ] ${package}`)
        process.stdout.cursorTo(0, y - 1 - packages.indexOf(package))
        process.stdout.clearLine(0)
        process.stdout.write(`[${proc}] ${(i / packages.length * 100).toFixed(0)} %`)
        process.stdout.cursorTo(0, y + packages.length - packages.indexOf(package))
    }
    const y = (await getCursorPos()).y - packages.length - 3
    for (let i = 0; i < y + packages.length + 2; i++) {
        process.stdout.cursorTo(0, i)
        process.stdout.clearLine(0)
    }
    process.stdout.cursorTo(0, y)
    process.stdout.clearLine(0)
    process.stdout.write('[Installer] Đã tải toàn bộ các gói tài nguyên\n')
    const update = await check()
    return download(update.version)
}

/**
 * @param {String} verison
 */
function download(version) {
    const superagent = require('superagent')
    process.stdout.write(`[Installer] Đang tải bản tải xuống mới (${version})...`)
    superagent.get(`https://api.github.com/repos/VaitoSoi/Mineflayer-Bot/zipball/${version}`)
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36')
        .end(async (err, res) => {
            process.stdout.cursorTo(0, (await getCursorPos()).y)
            process.stdout.clearLine(0)
            if (err) return process.stdout.write(`[Installer] Lỗi ${err}\n`)
            fs.writeFileSync(`./update.zip`, res.body)
            process.stdout.write(`[Installer] Đã tải xong file nén của bản tải xuống mới`)
            return unzip()
        })
}

async function unzip() {
    const unzipper = require('unzipper')
    const fs = require('fs-extra')
    process.stdout.write('[Installer] Đang giải nén file...')
    fs.copyFileSync('./package.json', './package-old.json')
    const unzip = async () => new Promise(async (resolve, reject) =>
        void await fs.createReadStream('./update.zip')
            .pipe(unzipper.Extract({ path: './' }))
            .on('end', () => resolve())
            .on('error', (err) => reject(err)))
    await unzip()
    process.stdout.cursorTo(0, (await getCursorPos()).y)
    process.stdout.clearLine(0)
    const file = fs.readdirSync('./').filter((file) => /^VaitoSoi-Mineflayer-Bot-(.+)$/.test(file))
    fs.copy(`./${file[0]}`, './', { overwrite: true })
    fs.removeSync(`./${file[0]}`)
    fs.removeSync('./update.zip')
    process.stdout.write('[Installer] Đã giải nén file')
    return install()
}

async function install() {
    console.clear()
    console.log('[Installer] Đang tải các gói tài nguyên...');
    const dependencies = require('./package.json').dependencies
    const packages = Object.keys(dependencies)
        .map(str => `${str}${dependencies[str]}`.replace('^', '@'))
    let i = 0;
    console.log(
        '[----------------------------------------] 0 %\n' +
        packages.map(str => `> [ Pending ] ${str}`).join('\n')
    )
    for await (let package of packages) {
        let err = ''
        await install_package(package).catch(() => err = true)
        //await require('node:timers/promises').setTimeout(1000)
        const pos = await getCursorPos()
        const y = pos.y - 1 - packages.length + packages.indexOf(package)
        let proc = ''
        i++
        for (let y = 0; y < (i / packages.length) * 40; y++) proc += '#'
        for (let y = 0; y < 40 - (i / packages.length) * 40; y++) proc += '-'
        process.stdout.cursorTo(0, Number(y))
        process.stdout.clearLine(0)
        process.stdout.write(`> [ ${err == true ? ' Error ' : ' Done '} ] ${package}`)
        process.stdout.cursorTo(0, y - 1 - packages.indexOf(package))
        process.stdout.clearLine(0)
        process.stdout.write(`[${proc}] ${(i / packages.length * 100).toFixed(0)} %`)
        process.stdout.cursorTo(0, y + packages.length - packages.indexOf(package))
    }
    const y = (await getCursorPos()).y - packages.length - 3
    for (let i = 0; i < y + packages.length + 2; i++) {
        process.stdout.cursorTo(0, i)
        process.stdout.clearLine(0)
    }
    process.stdout.cursorTo(0, y)
    process.stdout.clearLine(0)
    process.stdout.write('[Installer] Đã tải toàn bộ các gói tài nguyên\n')
    console.log('[Installer] Vui lòng khỏi động lại bot...')
    setTimeout(() => {
        process.exit(0)
    }, 5000)
}

run()