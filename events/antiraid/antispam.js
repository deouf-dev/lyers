const spammer = new Map();

module.exports = {
    name: "messageCreate",

    async run(client, message){
        const guild = message.guild;
        const guildData = client.managers.guildManager.getOrCreate(guild.id);
        let {toggle, punish, limit} = guildData.get("antiraid").antispam;
        limit = {time: limit.split("/")[1], messages: limit.split("/")[0]};
        if(toggle === "off") return;
        if(toggle === "on" && client.util.isWhitelist(guild, message.author.id) || toggle === "max" && client.util.isOwner(guild, message.author.id)) return;
        if(!spammer.has(`${guild.id}-${message.author.id}`)){
            spammer.set(`${guild.id}-${message.author.id}`, 1)
            setTimeout(() => spammer.delete(`${guild.id}-${message.author.id}`), require("ms")(`1${limit.time}`))
        }
        const data = spammer.get(`${guild.id}-${message.author.id}`)
        if(data >= limit.messages){
            const punished = await client.util.punish(punish, message.member, "Antimassping - lYers 📘");
            client.util.antiraidLog(guild, `${message.author} a spam les messages ${punished.punished ? `Je l'ai` : "Je n'ai pa pu le"} ${punish}`)
            spammer.delete(`${guild.id}-${message.author.id}`)
        }
    }
}