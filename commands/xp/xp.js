const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
     name: "xp",
     description: "Pannel de configuration du système d'xp",
     userPermissions: ["Administrator"],


     async run(client, interaction, guildData){
          const config = guildData.get("xp");
          const message = await interaction.reply({embeds: [embed()], components: [menu()], fetchReply: true})
          const collector = message.createMessageComponentCollector({
               filter: (i) => i.user.id === interaction.user.id,
               time: 300000
          })
          
          collector.on("collect", async(collected) => {
               const value = collected.values[0];
               if(value === "xp-message"){
                    await collected.reply({content: "Quel est le nombre d'xp reçu par message ?", fetchReply: true});
                    msgCollector().on("collect", async(response) => {
                         if(isNaN(response.content)) return await error(response, "Nombre invalide")
                         config.xpPerMessage = response.content;
                         update();
                         collected.deleteReply();
                         response.delete();
                         update()
                    })
               }else if(value === "xp-voice"){
                    await collected.reply({content: "Quel est le nombre d'xp reçu par minute en vocal ?", fetchReply: true});
                    msgCollector().on("collect", async(response) => {
                         if(isNaN(response.content)) return await error(response, "Nombre invalide")
                         config.xpPerMinuteInVoice = response.content;
                         update();
                         collected.deleteReply();
                         response.delete();
                         update()
                    })
               }else if(value === "channel"){
                    await collected.reply({content: "Quel est le salon des messages de level ?", fetchReply: true});
                    msgCollector().on("collect", async(response) => {
                         const channel = client.util.getChannel(response, response.content)
                         if(!channel || channel.type !== 0) return await error(response, "Salon invalide")
                         console.log(channel)
                         config.channel = channel.id
                         update();
                         collected.deleteReply();
                         response.delete();
                         update()
                    })
               }else if(value === "toggle"){
                    collected.deferUpdate()
                    config.toggle = config.toggle ? false : true;
                    update();
               }
               function msgCollector(){
                    return collected.channel.createMessageCollector({filter: (m) => m.author.id === interaction.user.id, max: 1});
               }
               async function error(response, content){
                    const r = await response.reply(content);
                    await client.util.sleep(3000)
                    r.delete()
                    response.delete()
                    collected.deleteReply()
               }
               function update(){
                    guildData.set("xp", config)
                    interaction.editReply({embeds: [embed()], components: [menu()]})
               }
          })
          function embed(){
               return {
                    title: "Xp Pannel",
                    color: guildData.get("color"),
                    fields: [
                         {name: `${client.botemojis.xp} Xp par message`, value: `\`${config.xpPerMessage}\``},
                         {name: `${client.botemojis.xp} Xp par minute en vocal`, value: `\`${config.xpPerMinuteInVoice}\``},
                         {name: `${client.botemojis.channel} Salon des messages level`, value: `${config.channel ? `<#${config.channel}>` : "Aucun"}`},
                         {name: `Status`, value: `${config.toggle ? client.botemojis.on : client.botemojis.off}`}
                    ]
               }
          }
          function menu(){
               return new ActionRowBuilder().setComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId("menu-xp")
                    .setPlaceholder("lYers 📘")
                    .addOptions(
                         {
                              label: "Xp message",
                              description: "Modifier le nombre d'xp reçu par message",
                              value: "xp-message",
                              emoji: {id: client.util.getEmojiId(client.botemojis.xp)}
                         },
                         {
                              label: "Xp vocal",
                              description: "Modifier le nombre d'xp reçu par minute en vocal",
                              value: "xp-voice",
                              emoji: {id: client.util.getEmojiId(client.botemojis.xp)}
                         },
                         {
                              label: "Salon",
                              description: "Modifier le salon des messages de level",
                              value: "channel",
                              emoji:{id: client.util.getEmojiId(client.botemojis.channel)}
                         },
                         {
                              label: `${config.toggle ? "Désactiver" : "Activer"}`,
                              description: `${config.toggle ? "Désactiver" : "Activer"} le système d'xp`,
                              value: "toggle",
                              emoji: {id: client.util.getEmojiId(config.toggle ? client.botemojis.off : client.botemojis.on)}
                         }
                    )
               )
          }
     }
}