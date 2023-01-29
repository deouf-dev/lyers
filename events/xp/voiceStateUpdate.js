const map = new Map()

module.exports = {
     name: "voiceStateUpdate",

     async run(client, oldVoice, newVoice){
          const guildData = client.managers.guildManager.getOrCreate(newVoice.guild.id);
          const userData = client.managers.userManager.getOrCreate(newVoice.id)
          const config = guildData.get("xp")
          if(!config.toggle) return;
          function addXp(){
               const xp = userData.get("xp")[newVoice.guild.id] || {xp: 0, level: 1};
               const xps = userData.get("xp")
               if(xp.xp + config.xpPerMinuteInVoice >= client.util.getXpForLevel(xp.level + 1)){
                    xps[newVoice.guild.id] = {xp: xp.xp, level: xp.level + 1}
                    client.emit("xpLevelUpgrade", newVoice.guild, newVoice.member, xp.level+1)
               }else {
                    xps[newVoice.guild.id] = {level: xp.level, xp: xp.xp + config.xpPerMinuteInVoice}
               }
               userData.set("xp", xps)
          }
          if(oldVoice.channel && !newVoice.channel){
               if(map.has(`${newVoice.guild.id}-${newVoice.id}`)){
                    const interval = map.get(`${newVoice.guild.id}-${newVoice.id}`)
                    clearInterval(interval)
                    map.delete(`${newVoice.guild.id}-${newVoice.id}`)
               }
          }else if(!oldVoice.channel && newVoice.channel){
               if(map.has(`${newVoice.guild.id}-${newVoice.id}`)) return;
               map.set(`${newVoice.guild.id}-${newVoice.id}`, setInterval(() => addXp(), 60000))
          }
          setInterval(() => {
               map.clear()
          }, require("ms")("2h"))
     }
}