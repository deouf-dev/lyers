const Captcha = require("@haileybot/captcha-generator")

module.exports = {
     name: "guildMemberAdd",

     async run(client, member){
          const {guild} = member;
          const guildData = client.managers.guildManager.getOrCreate(guild.id)
          const config = guildData.get("captcha")

          if(!config.toggle) return;
          if(member.user.bot) return member.roles.add(config.role).catch((e) => {});
          const channel = guild.channels.cache.get(config.channel)
          if(!channel) return;


          const captcha = new Captcha();
          channel.send({content: `${member}, vous avez 2m pour résoudre le captcha`, files: [{attachment: captcha.PNGStream, name: "captcha.png"}]}).then((message) => {
               const collector = channel.createMessageCollector({filter: (m) => m.author.id === member.user.id});
               const timeout = setTimeout(() => (member.kick().catch((e) => {}), collector.stop(), message.delete().catch(e => {})), 120000)
               collector.on("collect", async(collected) => {
                    if(collected.content.toUpperCase() === captcha.value){
                         clearTimeout(timeout)
                         collector.stop();
                         message.delete();
                         member.roles.add(config.role).catch((e) => {})
                    }else {
                         collected.reply("Mauvaise réponse, réessayez").then(async(m) => (await client.util.sleep(1500), m.delete(), collected.delete()))
                    }
               })
          })
     }
}