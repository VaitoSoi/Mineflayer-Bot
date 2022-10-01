const fs = require('fs-extra')
const color = require('./color').code
let global_y = 0

async function check() {
    const axios = require('axios').default
    const res = await axios.get('https://api.github.com/repos/vaitosoi/mineflayer-bot/releases/latest')
    const old_version = require('../package.json').version
    return { check: res.data.tag_name == old_version, version: String(res.data.tag_name), data: res.data }
}

async function confirm() {
    const prompt = require('prompt')
    const update = await check()
    const res = update.data
    prompt.start()
    console.log('[Auto-Update] Phát hiện bản cập nhật mới.')
    console.log(`[Auto-Update] Nội dung bản cập nhật:\n${res.body}`)
    console.log(`[Auto-Update] Bạn có muốn cập nhật lên bản ${res.tag_name} không ?`)
    prompt.get({
        properties: {
            confirm: {
                description: 'confirm (Y/n)',
                type: 'string',
                pattern: /^(y|n|Y|N)$/,
                message: 'Lựa chọn chỉ bao gồm: y, n',
                default: 'y'
            }
        }
    }).then((prompt_res) => {
        if (prompt_res.confirm.toLowerCase() == 'n') {
            process.stdout.write('[Auto-Update] Đã dừng cập nhật')
            setTimeout(() => {
                require('../cmd')()
            }, 5000);
        } else {
            console.clear()
            console.log('[Auto-Update] Bắt đầu việc cập nhật')
            global_y++
            return delete_file(update.version)
        }
    })
}

async function delete_file(str) {
    fs.readdirSync('./').forEach(file => {
        if (['modules', 'node_modules'].includes(file)) return
        require('fs-extra').removeSync(`./${file}`)
    })
    download(str)
}

/**
 * @param {String} verison
 */
async function download(version) {
    const superagent = require('superagent')
    process.stdout.write(`${color.yellow, `[Auto-Update] Đang tải bản cập nhật mới (${version})...`}`)
    superagent.get(`https://api.github.com/repos/VaitoSoi/Mineflayer-Bot/zipball/${version}`)
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36')
        .end((err, res) => {
            if (err) return console.error(`${color.red, `[Auto-Update] Lỗi ${err}`}`)
            fs.writeFileSync(`./update.zip`, res.body)
            process.stdout.cursorTo(0, global_y)
            process.stdout.clearLine(0)
            console.log(`${color.green, `[Auto-Update] Đã tải xong bản cập nhật mới`}`)
            global_y++
            return unzip()
        })
}

async function unzip() {
    const unzipper = require('unzipper')
    const fs = require('fs-extra')
    process.stdout.write('[Auto-Update] Đang giải nén file...')
    await (async () =>
        new Promise((resolve) =>
            void fs.createReadStream('./update.zip')
                .pipe(unzipper.Extract({ path: './' }))
                .on('close', () => resolve())
        )
    )().then(async () => {
        process.stdout.cursorTo(0, global_y)
        process.stdout.clearLine(0)
        const file = fs.readdirSync('./').filter((file) => /^VaitoSoi-Mineflayer-Bot-(.+)$/.test(file))
        await fs.copy(`./${file[0]}`, './', { overwrite: true })
        fs.removeSync(`./${file[0]}`)
        fs.removeSync('./update.zip')
        console.log('[Auto-Update] Đã giải nén file')
        global_y++
        return install()
    })
}

const install_package = (package) => new Promise((resolve, reject) =>
    require('child_process').exec(`npm install ${package}`, async (err, output) =>
        err ? reject(err) : resolve(output)
    ))

async function install() {
    //console.clear()
    process.stdout.cursorTo(0, global_y)
    console.log('[Auto-Update] Đang tải các gói tài nguyên...');
    global_y++
    const dependencies = require('../package.json').dependencies
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
    console.log('[Auto-Update] Đã tải toàn bộ các gói tài nguyên')
    global_y++
    console.log('[Auto-Update] Đã tải toàn bộ bot.')
    console.log('[Auto-Update] Vui lòng khởi động lại bot sau 5s.')
    setTimeout(() => process.exit(0), 5000)
}


module.exports = { confirm, check }

//confirm(false)