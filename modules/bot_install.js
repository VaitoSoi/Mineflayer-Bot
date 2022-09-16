const fs = require('fs-extra')
const readline = require('readline')

async function check() {
    const axios = require('axios').default
    const res = await axios.get('https://api.github.com/repos/vaitosoi/mineflayer-bot/releases/latest')
    const old_version = require('./package.json').version
    return { check: res.data.tag_name == old_version, version: String(res.data.tag_name), full: res.data }
}

async function clear_n_log(string, mode) {
    await readline.clearLine(process.stdout, 0)
    await readline.moveCursor(process.stdout, 0)
    if (mode == 0 || !mode) console.log(string)
    else console.error(string)
    return undefined
}

async function run() {
    const update = await check()
    return download(update.version)
}


/**
 * @param {String} verison
 */
async function download(version) {
    const superagent = require('superagent')
    console.log(`[Installer] Đang tải bản tải xuống mới (${version})...`)
    superagent.get(`https://api.github.com/repos/VaitoSoi/Mineflayer-Bot/zipball/${version}`)
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36')
        .end((err, res) => {
            if (err) return console.error(`[Installer] Lỗi ${err}`)
            fs.writeFileSync(`./update.zip`, res.body)
            console.log(`[Installer] Đã tải xong bản tải xuống mới`)
            return unzip()
        })
}

async function unzip() {
    const unzipper = require('unzipper')
    console.log(`${'[Installer] Đang giải nén file...'}`)
    fs.copyFileSync('./package.json', './package-old.json')
    const unzip = async () => new Promise(async (resolve, reject) =>
        void await fs.createReadStream('./update.zip')
            .pipe(unzipper.Extract({ path: './' }))
            .on('end', () => resolve())
            .on('error', (err) => reject(err)))
    await unzip()
    console.log(`[Installer] Đã tải giải nén file`)
    const file = fs.readdirSync('./').filter((file) => /^VaitoSoi-Mineflayer-Bot-(.+)$/.test(file))
    fs.copy(`./${file[0]}`, './', { overwrite: true })
    fs.removeSync(`./${file[0]}`)
    fs.removeSync('./update.zip')
    return check_package()
}

function check_package() {
    const old = require('./package-old.json')
    const current = require('./package.json')
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
                console.log('[Installer] Đã hoàn thành việc tải xuống')
                require('./index')
            }
            else continue
        }
    }
}

async function install() {
    console.log('[Installer] Đang tải lại các gói tài nguyên...')
    fs.removeSync('./node_module')
    const child_process = require('child_process')
    const packages = require('./package.json').dependencies
    let dependencies = Object.keys(packages).map(str => `${str}${packages[str]}`)
    let i = 0
    let install = (package) => {
        child_process.exec(`npm install ${package}`, async (err) => {
            if (err) {
                await clear_n_log(`[Installer] Lỗi ${err}`);
                i++
                log();
            } else { i++; log() }
        })
    }
    let log = async () => {
        if (i < dependencies.length) {
            let name = dependencies[i].slice(0, dependencies[i].split('').indexOf('^'))
            let version = dependencies[i].slice(dependencies[i].split('').indexOf('^') + 1)
            await clear_n_log(`${`[Installer] [${Math.floor(i / (dependencies.length) * 100)}%]`} Đang tải gói '${name}' (ver ${version})...`);
            install(`${name}@${version}`)
        } else {
            await clear_n_log(`${'[Installer] [100%] Đã tải toàn bộ gói tài nguyên'}`)
            console.log('[Installer] Đã hoàn thành việc tải xuống')
            const file = require('edit-json-file')('./package.json', { autosave: true })
            file.set('version', (await check()).version)
            require('./index')
        }
    }
    log()
}

run()