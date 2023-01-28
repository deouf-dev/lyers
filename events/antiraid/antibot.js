module.exports = {
    name: "guildMemberAdd",

    async run(client, member){
        if(!member.user.bot) return;
        const guild = member.guild;
        const guildData = client.managers.guildManager.getOrCreate(guild.id);
        const {toggle, punish} = guildData.get("antiraid").antibot;
        if(toggle === "off") return;
        const log = (await guild.fetchAuditLogs({
            type: 28,
            limit: 5
        })).entries.find((l) => l.target.id === member.user.id);
        if(!log) return;
        const {executor} = log;
        const executorMember = guild.members.cache.get(executor.id)
        if(toggle === "on" && client.util.isWhitelist(guild, executor.id) || toggle === "max" && client.util.isOwner(guild, executor.id)) return client.util.antiraidLog(guild, `${executor} a ajouté le bot ${member}`)
        await member.kick();
        const punished = await client.util.punish(punish, executorMember, "Antibot - lYers 📘");
        client.util.antiraidLog(guild, `${executor} a ajouté le bot ${member}\n${punished.punished ? `Je l'ai` : "Je n'ai pa pu le"} ${punish}`)
        
    }
}