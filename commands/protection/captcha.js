const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
     name: "captcha",
     description: "Panel de configuration du captcha",
     owner: true,
     userPermissions: ["Administrator"],

     async run(client, interaction, guildData){
          const config = guildData.get("captcha");
          const message = await interaction.reply({embeds: [embed()], components: [buttons()], fetchReply: true})
          const collector = message.createMessageComponentCollector({
               filter: (i) => i.user.id === interaction.user.id
          })
          collector.on("collect", async(collected) => {
               const value = collected.customId
               if(value === "channel"){
                    collected.reply({content: "Quel est le salon du captcha ?", fetchReply: true})
                    collected.channel.createMessageCollector({filter: (m) => m.author.id === interaction.user.id, max: 1})
                    .on("collect", async(response) => {
                         const channel = client.util.getChannel(response, response.content)
                         if(!channel || channel.type !== 0)
                              return response.reply("Salon invalide").then(async(m) => (await client.util.sleep(3000), response.delete(), collected.deleteReply(), m.delete()))
                         config.channel = channel.id;     
                         update();
                         collected.deleteReply();
                         response.delete()
                    })
               }else if(value === "toggle"){
                    collected.deferUpdate();
                    config.toggle = config.toggle ? false : true;
                    update()
               }else if(value === "role"){
                    collected.reply({content: "Quel est le rôle membre ?", fetchReply: true})
                    collected.channel.createMessageCollector({filter: (m) => m.author.id === interaction.user.id, max: 1})
                    .on("collect", async(response) => {
                         const role = client.util.getRole(response, response.content)
                         if(!role || role.managed)
                              return response.reply("Salon invalide").then(async(m) => (await client.util.sleep(3000), response.delete(), collected.deleteReply(), m.delete()))
                         config.role = role.id;     
                         update();
                         collected.deleteReply();
                         response.delete()
                    })
               }
          })
          function embed(){
               return {
                    title: `Panel Captcha`,
                    color: guildData.get("color"),
                    fields: [
                         {name: `${client.botemojis.channel} Salon`, value: config.channel ? `<#${config.channel}>` : "Indéfini"},
                         {name: `${client.botemojis.role} Rôle membre`, value: config.role ? `<@&${config.role}>` : "Indéfini"},
                         {name: `Status`, value: config.toggle ?  client.botemojis.on : client.botemojis.off}

                    ]
               }
          }
          function buttons(){
               return new ActionRowBuilder()
               .setComponents(
                    new ButtonBuilder({label: "Salon", custom_id: "channel", style: 1}),
                    new ButtonBuilder({label: "Rôle", custom_id: "role", style: 1}),
                    new ButtonBuilder({label: config.toggle ? "Désactiver" : "Activer", style: config.toggle ? 4 : 3,  custom_id: "toggle"})
               )
          }
          function update(){
               guildData.set("captcha", config)
               interaction.editReply({embeds: [embed()], components: [buttons()]})
          }
     }
}