const fs = require('fs-extra')
const color = require('./color').code
const readline = require('readline')

async function check() {
    const axios = require('axios').default
    const res = await axios.get('https://api.github.com/repos/vaitosoi/mineflayer-bot/releases/latest')
    const old_version = require('../package.json').version
    return { check: res.data.tag_name == old_version, version: String(res.data.tag_name), full: res.data }
}

function clear_n_log(string, mode) {
    readline.clearLine(process.stdout, 0)
    readline.moveCursor(process.stdout, 0)
    if (mode == 0 || !mode) console.log(string)
    else console.error(string)
    return undefined
}

/**
 */
async function confirm() {
    console.log('[Auto-Update] Đang kiểm tra bản cập nhật mới...')
    const prompt = require('prompt')
    const update = await check()
    const res = update.full
    if (update.check == true) {
        console.log('[Auto-Update] Không có bản cập nhật mới')
        require('../index')
    }
    else {
        prompt.start()
        console.log('[Auto-Update] Phát hiện bản cập nhật mới.')
        console.log(`[Auto-Update] Nội dung bản cập nhật:\n${res.data.body}`)
        console.log(`[Auto-Update] Bạn có muốn cập nhật lên bản ${res.data.tag_name} không ?`)
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
                console.log('[Auto-Update] Đã dừng cập nhật')
                require('../index')
            } else return download(update.version)
        })
    }
}

/**
 * @param {String} verison
 */
async function download(version) {
    const superagent = require('superagent')
    console.log(`${color.yellow, `[Auto-Update] Đang tải bản cập nhật mới (${version})...`}`)
    superagent.get(`https://api.github.com/repos/VaitoSoi/Mineflayer-Bot/zipball/${version}`)
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36')
        .end((err, res) => {
            if (err) return console.error(`${color.red, `[Auto-Update] Lỗi ${err}`}`)
            fs.writeFileSync(`./update.zip`, res.body)
            console.log(`${color.green, `[Auto-Update] Đã tải xong bản cập nhật mới`}`)
            return unzip()
        })
}

async function unzip() {
    const unzipper = require('unzipper')
    console.log(`${color.yellow, '[Auto-Update] Đang giải nén file...'}`)
    fs.copyFileSync('./package.json', './package-old.json')
    const unzip = async () => new Promise(async (resolve, reject) =>
        void await fs.createReadStream('./update.zip')
            .pipe(unzipper.Extract({ path: './' }))
            .on('close', () => resolve())
            .on('error', (err) => reject(err)))
    await unzip()
    console.log(`${color.green, `[Auto-Update] Đã tải giải nén file`}`)
    const file = fs.readdirSync('./').filter((file) => /^VaitoSoi-Mineflayer-Bot-(.+)$/.test(file))
    fs.copy(`./${file[0]}`, './', { overwrite: true })
    fs.removeSync(`./${file[0]}`)
    fs.removeSync('./update.zip')
    return check_package()
}

function check_package() {
    const old = require('../package-old.json')
    const current = require('../package.json')
    const old_array = Object.keys(old.dependencies).map(str => old.dependencies[str])
    const current_array = Object.keys(current.dependencies).map(str => current.dependencies[str])
    if (old_array.length != current_array.length) {
        fs.removeSync('./package-old.json')
        return install()
    }
    else {
        let i = old_array.length >= current_array.length ? old_array.length : current_array.length
        for (let y = 0; y <= i; y++) {
            if (old_array[y] != current_array[y]) {
                fs.removeSync('./package-old.json')
                return install()
            } else if (y == i) {
                fs.removeSync('./package-old.json')
                console.log('[Auto-Update] Đã hoàn thành việc cập nhật')
                require('../index')
            }
            else continue
        }
    }
}

async function install() {
    console.log(color.yellow, '[Auto-Update] Đang tải lại các gói tài nguyên...')
    fs.removeSync('./node_module')
    const child_process = require('child_process')
    const packages = require('../package.json').dependencies
    let dependencies = Object.keys(packages).map(str => `${str}${packages[str]}`)
    let i = 0
    let install = (package) => {
        child_process.exec(`npm install ${package}`, async (err) => {
            if (err) {
                clear_n_log(`${color.red, `[Auto-Update] ${err}`}`, 1);
                i++
                log();
            } else { i++; log() }
        })
    }
    let log = async () => {
        if (i < dependencies.length) {
            let name = dependencies[i].slice(0, dependencies[i].split('').indexOf('^'))
            let version = dependencies[i].slice(dependencies[i].split('').indexOf('^') + 1)
            clear_n_log(`${color.blue, `[Auto-Update] [${Math.floor(i / (dependencies.length) * 100)}%]`} Đang tải gói '${name}' (ver ${version})...`);
            install(`${name}@${version}`)
        } else {
            clear_n_log(`${color.green, '[Auto-Update] [100%] Đã tải toàn bộ gói tài nguyên'}`)
            console.log('[Auto-Update] Đã hoàn thành việc cập nhật')
            const file = require('edit-json-file')('./package.json', { autosave: true })
            file.set('version', (await check()).version)
            require('../index')
        }
    }
    log()
}

module.exports = { confirm, check }

//confirm(false)