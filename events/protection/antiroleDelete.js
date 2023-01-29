module.exports = {
    name: "roleDelete",

    async run(client, role) {
        if(role.managed) return;
        const guild = role.guild;
        const guildData = client.managers.guildManager.getOrCreate(guild.id);
        const {toggle, punish} = guildData.get("antiraid").antiroleDelete;
        if(toggle === "off") return;
        const log = (await guild.fetchAuditLogs({
            type: 32,
            limit: 5
        })).entries.find((l) => l.target.id === role.id);
        if(!log) return;
        const {executor} = log;
        if(executor.id === client.user.id) return;
        const executorMember = guild.members.cache.get(executor.id)
        if(toggle === "on" && client.util.isWhitelist(guild, executor.id) || toggle === "max" && client.util.isOwner(guild, executor.id)) return client.util.antiraidLog(guild, `${executor} a ajouté le bot ${member}`)
        await guild.roles.create({
            name: role.name,
            color: role.color,
            hoist: role.hoist,
            position: role.rawPosition,
            permissions: role.permissions,
            mentionable: role.mentionable
        })
        const punished = await client.util.punish(punish, executorMember, "AntiroleDelete - lYers 📘");
        client.util.antiraidLog(guild, `${executor} a supprimer un rôle\n${punished.punished ? `Je l'ai` : "Je n'ai pa pu le"} ${punish}`)
    }
}