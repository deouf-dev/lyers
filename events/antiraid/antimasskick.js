const spammer = new Map();


module.exports = {
    name: "guildMemberLeave",
    spammer,
    async run(client, member){
        const guild = member.guild;
        const guildData = client.managers.guildManager.getOrCreate(guild.id);
        const {toggle, punish, limit} = guildData.get("antiraid").antimasskick;
        const log = (await guild.fetchAuditLogs({
            type: 22,
            limit: 5,
        })).entries.find((l) => l.target.id === member.user.id);
        if(!log) return;
        const {executor} = log;
        if(executor.id === client.user.id) return;
        const executorMember = guild.members.cache.get(executor.id)
        if(toggle === "on" && client.util.isWhitelist(guild, executor.id) || toggle === "max" && client.util.isOwner(guild, executor.id)) return client.util.antiraidLog(guild, `${executor} a ban ${member}`)
        if(!spammer.has(`${guild.id}-${executor.id}`)){
            spammer.set(`${guild.id}-${executor.id}`, 1)
            setTimeout(() => spammer.delete(`${guild.id}-${executor.id}`), require("ms")("1"+limit.split("/")[1]))
        }
        const data = spammer.get(`${guild.id}-${executor.id}`)
        if(limit.split("/")[0] <= data){
            const punished = await client.util.punish(punish, executorMember, "Antimasskick - lYers 📘");
            client.util.antiraidLog(guild, `${executor} a expulsé plus de ${limit.split("/")[0]} personne(s) ${punished.punished ? `Je l'ai` : "Je n'ai pa pu le"} ${punish}`)
            spammer.delete(`${guild.id}-${executor.id}`)
        }
    }
}