const mineflayer = require('mineflayer')

module.exports = {
    name: 'playerLeft',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {mineflayer.Player} player 
     */
    async run(bot, player) {
        console.log(`[Server] ${player.username} đã thoát server`)
    }
}