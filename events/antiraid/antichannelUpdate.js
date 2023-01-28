module.exports = {
    name: "channelUpdate",

    async run(client, oldChannel, newChannel){
        if(oldChannel === newChannel) return;
        const guild = newChannel.guild;
        const guildData = client.managers.guildManager.getOrCreate(guild.id)
        const {toggle, punish} = guildData.get("antiraid").antichannelUpdate;
        if(toggle === "off") return;
        const log = (await guild.fetchAuditLogs({
            type: 31,
            limit: 5
        })).entries.find((l) => l.target.id === newChannel.id);
        if(!log) return;
        const {executor} = log;
        if(executor.id === client.user.id) return;
        const executorMember = guild.members.cache.get(executor.id)
        if(toggle === "on" && client.util.isWhitelist(guild, executor.id) || toggle === "max" && client.util.isOwner(guild, executor.id)) return client.util.antiraidLog(guild, `${executor} a ajouté le bot ${member}`)
        await newChannel.edit({
            name: oldChannel.name,
            color: oldChannel.color,
            hoist: oldChannel.hoist,
            position: oldChannel.position,
            permissions: oldChannel.permissions,
            mentionable: oldChannel.mentionable
        })
        const punished = await client.util.punish(punish, executorMember, "AntichannelUpdate - lYers 📘");
        client.util.antiraidLog(guild, `${executor} a modifié un salon\n${punished.punished ? `Je l'ai` : "Je n'ai pa pu le"} ${punish}`)
    }
}