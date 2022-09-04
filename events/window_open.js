const mineflayer = require('mineflayer')
const window = require('prismarine-windows');
const color = require('../modules/color').code;

module.exports = {
    name: 'windowOpen',
    /**
     * @param {mineflayer.Bot} bot 
     * @param {window.Window} reason 
     */
    async run(bot, window) {
        if (window.slots.length == 63) {
            bot.simpleClick.leftMouse(13);
            console.log('[Console] Đã click vào ô CHUYỂN_SERVER.')
        } else if (window.slots.length == 46) {
            const pass = bot.config.pin.split(' ').map(str => Number(str))
            const p1 = pass[0];
            const p2 = pass[1];
            const p3 = pass[2];
            const p4 = pass[3];
            if ((!p1 || isNaN(p1))
                || (!p2 || isNaN(p2))
                || (!p3 || isNaN(p3))
                || (!p4 || isNaN(p4))) console.error(color.red, '[Error] Vui lòng kiểm tra lại mật khẩu')
            bot.simpleClick.leftMouse(p1);
            bot.simpleClick.leftMouse(p2);
            bot.simpleClick.leftMouse(p3);
            bot.simpleClick.leftMouse(p4);
            console.log(color.green, '[Console] Đã nhập pin!')
        }
    }
}