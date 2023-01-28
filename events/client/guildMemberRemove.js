module.exports = {
     name: "guildMemberRemove",

     async run(client, member){
         const {guild} = member;
         const guildData = client.managers.guildManager.getOrCreate(guild.id);
         const config = guildData.get("invite").leave;
         if(!config.channel || !config.message) return;
         const channel = guild.channels.cache.get(config.channel);
         let invites = [];
         Object.keys(guildData.get("invites")).forEach((i) => invites.push(guildData.get("invites")[i]))
         const data = invites.find((i) => i.invited.includes(member.user.id))
         if(!data) return channel.send(`${member} a quitté, mais je ne sais pas qui l'a invité`)
         if(!channel) return;
         data.leaves = data.leaves + 1;
         const alldata = guildData.get("invites")
         alldata[data.id] = data;
         guildData.set("invites", alldata);
         channel.send(client.util.replaceInvitesVariables(config.message, await client.users.fetch(data.id), member, guild, data.joins - data.leaves)).catch((e) => {})
     }
}