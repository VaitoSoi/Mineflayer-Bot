module.exports = {
    name: 'run',
    aliases: ['start'],
    description: 'Khởi động bot',
    run: async () => {
        require('../run')()
    }
}