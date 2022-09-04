module.exports = {
    name: 'line',
    rl: true,
    /**
     * @param {String} input 
     */
    async run (bot, input) {
        if (!bot.player) return
        if (input == '') return
        bot.chat(input)
    }
}