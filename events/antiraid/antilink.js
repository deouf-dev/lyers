module.exports = {
    name: "messageCreate",

    async run(client, message){
        if(message.author.bot) return;
        let discordInvite =/(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
        let reg =/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        if(!discordInvite.test(message.content) && !reg.test(message.content)) return;
        const guild = message.guild;
        const guildData = client.managers.guildManager.getOrCreate(guild.id);
        const {toggle} = guildData.get("antiraid").antilink;
        if(toggle === "off") return;
        if(toggle === "on" && client.util.isWhitelist(guild, message.author.id) || toggle === "max" && client.util.isOwner(guild, message.author.id)) return;
        message.delete().then(() => {
            message.channel.send(`${message.member} les liens ne sont pas autorisé`).then((m) => setTimeout(() => m.delete(), 3000))
        })
    }
}