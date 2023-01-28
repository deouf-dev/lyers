module.exports = {
    name: "roleUpdate",

    async run(client, oldRole, newRole){
        if(oldRole === newRole) return;
        const guild = newRole.guild;
        const guildData = client.managers.guildManager.getOrCreate(guild.id)
        const {toggle, punish} = guildData.get("antiraid").antiroleUpdate;
        if(toggle === "off") return;
        const log = (await guild.fetchAuditLogs({
            type: 31,
            limit: 5
        })).entries.find((l) => l.target.id === newRole.id);
        if(!log) return;
        const {executor} = log;
        if(executor.id === client.user.id) return;
        const executorMember = guild.members.cache.get(executor.id)
        if(toggle === "on" && client.util.isWhitelist(guild, executor.id) || toggle === "max" && client.util.isOwner(guild, executor.id)) return client.util.antiraidLog(guild, `${executor} a ajouté le bot ${member}`)
        await newRole.edit({
            name: oldRole.name,
            color: oldRole.color,
            hoist: oldRole.hoist,
            position: oldRole.position,
            permissions: oldRole.permissions,
            mentionable: oldRole.mentionable
        })
        const punished = await client.util.punish(punish, executorMember, "AntiroleUpdate - lYers 📘");
        client.util.antiraidLog(guild, `${executor} a modifié un rôle\n${punished.punished ? `Je l'ai` : "Je n'ai pa pu le"} ${punish}`)
    }
}