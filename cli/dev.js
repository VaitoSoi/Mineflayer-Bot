module.exports = {
    name: 'dev',
    description: 'Dành cho dev thử nghiệm tính năng mới',
    usage: '| Nếu bạn là dev thì chắc chắn biết cách dùng rồi :))',
    /**
     * @param {String[]} args 
     * @param {Object} cmds 
     */
    run: async (args, cmds) => {
        if (args[1] == 'err')
            throw new Error(args[2] ? args.slice(2).join(' ') : 'Testing...')
        else if (args[1] == 'reload') {
            const color = require('../modules/color').code
            const fs = require('node:fs')
            const reloadDir = (dir) =>
                fs.readdirSync(dir).forEach(async (file) => {
                    if ([
                        '.github',
                        '.idea',
                        '.git',
                        'node_modules'
                    ].includes(file)) return;
                    if (!file.toLowerCase().endsWith('.js') && !fs.lstatSync(`${dir}/${file}`).isDirectory()) try {
                        require(`../${dir}/${file}`);
                    }
                        catch {
                            return;
                        }
                    if (fs.lstatSync(`${dir}/${file}`).isDirectory()) reloadDir(`${dir}/${file}`);
                    else {
                        delete require.cache[require.resolve(`../${dir}/${file}`)];
                        console.log(color.green, `Reloaded ${dir}/${file}`);
                    }
                });
            if (!args[2]) reloadDir('./cli');
            else if (args[2].toLowerCase() === 'all') reloadDir('.');
            else {
                if (args[2] !== 'dir' && args[2] !== 'file') reloadDir(args[2]);
                else if (args[2] === 'dir') reloadDir(args[3]);
                else if (args[2] === 'file') {
                    delete require.cache[require.resolve(`../${args[3]}`)];
                    console.log(color.green, `Reloaded ${args[3]}`);
                }
            }
            console.log(color.green, '[Reload] Done');
        } else if (args[1] == 'exit') process.exit(0)
    }
}