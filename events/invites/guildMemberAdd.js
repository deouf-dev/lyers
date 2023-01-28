module.exports = {
     name: "guildMemberAdd",

     async run(client, member, inviter, invite, error){
         const {guild} = member;
         const guildData = client.managers.guildManager.getOrCreate(guild.id);
         const config = guildData.get("invite").join;
         if(!config.channel || !config.message) return;
         const channel = guild.channels.cache.get(config.channel);
         if(invite.isVanity) return channel.send(`${member} a rejoint avec l'url personnalisé du serveur`)
         if(!inviter) return channel.send(`${member} a rejoint, mais je ne sais pas qui l'a invité`)
         if(!channel) return;
         const data = guildData.get("invites")[inviter.id] || {id: inviter.id, joins: 0, leaves: 0, invited: [member.user.id]};
         data.joins = data.joins + 1;
         const alldata = guildData.get("invites")
         alldata[inviter.id] = data;
         guildData.set("invites", alldata);
         channel.send(client.util.replaceInvitesVariables(config.message, inviter, member, guild, data.joins - data.leaves)).catch((e) => {})
     }
}