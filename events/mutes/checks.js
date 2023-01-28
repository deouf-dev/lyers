module.exports = {
     name: "ready",

     async run(client){
          setInterval(() => {
               for(const key in client.database.mutes){
                    const data = client.database.mutes[key];
                    if(data.expireAt >= Date.now()){
                         const guild = client.guilds.cache.get(data.guildId);
                         if(!guild) return;
                         const member = guild.members.cache.get(member);
                         member?.roles.remove(data.muterole).catch((e) => {})
                    }
               }
          }, 400000)
     }
}