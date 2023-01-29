module.exports = {
    name: "channelDelete",

    async run(client, channel) {
        if(channel.managed) return;
        const guild = channel.guild;
        const guildData = client.managers.guildManager.getOrCreate(guild.id);
        const {toggle, punish} = guildData.get("antiraid").antichannelDelete;
        if(toggle === "off") return;
        const log = (await guild.fetchAuditLogs({
            type: 32,
            limit: 5
        })).entries.find((l) => l.target.id === channel.id);
        if(!log) return;
        const {executor} = log;
        if(executor.id === client.user.id) return;
        const executorMember = guild.members.cache.get(executor.id)
        if(toggle === "on" && client.util.isWhitelist(guild, executor.id) || toggle === "max" && client.util.isOwner(guild, executor.id)) return client.util.antiraidLog(guild, `${executor} a ajouté le bot ${member}`)
        await guild.channels.create({
            name: channel.name,
            color: channel.color,
            hoist: channel.hoist,
            position: channel.rawPosition,
            permissions: channel.permissions,
            mentionable: channel.mentionable
        })
        const punished = await client.util.punish(punish, executorMember, "AntichannelDelete - lYers 📘");
        client.util.antiraidLog(guild, `${executor} a supprimer un salon\n${punished.punished ? `Je l'ai` : "Je n'ai pa pu le"} ${punish}`)
    }
}