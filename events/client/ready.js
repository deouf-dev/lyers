module.exports = {
    name: "ready",


    async run(client){
        console.log("lYers on!")
        client.util.commitCommands();

        let base = "lYers 📘 v1"
        client.user.setPresence({activities: [{type: 0, name: base, url: "https://twitch.tv/lyers"}]})
        let i = 0
        setInterval(() => {
            let status = [base, `/help`, `${client.guilds.cache.size} serveurs`]
            i+1 >= status.length ? i = 0 : i++
            client.user.setPresence({activities: [{type: 0, name: status[i] || base, url: "https://twitch.tv/lyers"}]})
        }, require("ms")("30s"))
    }
}