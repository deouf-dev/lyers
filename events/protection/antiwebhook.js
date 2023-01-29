module.exports = {
    name: "webhookUpdate",

    async run(client, channel){
        const guild = channel.guild;
        const guildData = client.managers.guildManager.getOrCreate(guild.id);
        const {toggle, punish} = guildData.get("antiraid").antiwebhook;
        if(toggle === "off") return;
        const log = (await guild.fetchAuditLogs({
            type: 28,
            limit: 5
        })).entries.find((l) => l.target.id === channel.id && l.action === 50 | 51 | 52);
        if(!log) return;
        const {executor} = log;
        if(executor.id === client.user.id) return;
        const executorMember = guild.members.cache.get(executor.id)
        if(toggle === "on" && client.util.isWhitelist(guild, executor.id) || toggle === "max" && client.util.isOwner(guild, executor.id)) return client.util.antiraidLog(guild, `${executor} a crée un webhook`)
        guild.fetchWebhooks().forEach((w) => w.delete())
        const punished = await client.util.punish(punish, executorMember, "Antiwebhook - lYers 📘");
        client.util.antiraidLog(guild, `${executor} a crée un webhook\n${punished.punished ? `Je l'ai` : "Je n'ai pa pu le"} ${punish}`)

    }
}