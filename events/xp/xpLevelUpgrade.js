module.exports = {
     name: "xpLevelUpgrade",

     async run(client, guild, member, level){
          const guildData = client.managers.guildManager.getOrCreate(guild.id);
          if(!guildData.get("xp").channel || !guildData.get("xp").toggle) return;
          const channel = guild.channels.cache.get(guildData.get("xp").channel);
          if(!channel) return;
          channel.send(`${member}, tu es maintenant niveau **${level}**`)
     }
}