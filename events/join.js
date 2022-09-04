const mineflayer = require('mineflayer')

module.exports = {
    name: 'playerJoined',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {mineflayer.Player} player 
     */
    async run(bot, player) {
        if (!bot.player || Date.now() - bot.joinAt < 1000) return
        console.log(`[Server] ${player.username} đã vào server`)
    }
}