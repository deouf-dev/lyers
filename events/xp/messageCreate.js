module.exports = {
     name: "messageCreate",

     async run(client, message){
          if(message.author.bot) return;
          const guildData = client.managers.guildManager.getOrCreate(message.guild.id);
          const userData = client.managers.userManager.getOrCreate(message.author.id)
          const config = guildData.get("xp");
          if(!config.toggle) return;
          const userxp = userData.get("xp")[message.guild.id] || {xp: 0, level: 1};
          const userxps = userData.get("xp")
          if(userxp.xp + config.xpPerMessage >= client.util.getXpForLevel(userxp.level + 1)){
               userxps[message.guild.id] = {xp: config.xpPerMessage, level: userxp.level + 1}
               client.emit("xpLevelUpgrade", message.guild, message.member, userxp.level+1)
          }else {
               userxps[message.guild.id] = {xp: userxp.xp + config.xpPerMessage, level: userxp.level}
          }
          userData.set("xp", userxps)
     }
}