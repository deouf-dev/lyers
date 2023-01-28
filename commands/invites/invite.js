const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
     name: "invite",
     description: "Configurer le système d'invites",
     options: [
          {name: "config", description: "Configuration d'invites", type: 2, options: [
               {name: "join", description: "Configurer le système d'invites join", type: 1},
               {name: "leave", description: "Configurer le système d'invites leave", type: 1},
          ]},
          {
               name: "variables", description: "Variables du message d'invitations", type:1
          }
     ],
     userPermissions: ["Administrator"],

     async run(client, interaction, guildData){
         const cmd = interaction.options.getSubcommand();
         if(cmd === "join"){
          const config = guildData.get("invite").join;
          const message = await interaction.reply({embeds: [embed("Join Config", config)], components: [menu()], fetchReply: true});
          const collector = interaction.channel.createMessageComponentCollector({
               filter: (i) => i.user.id === interaction.user.id && i.message.id === message.id
          });
          collector.on("collect", async(collected) => {
               const value = collected.values[0];
               if(value === "channel"){
                    collected.reply({content: "Quel est le salon ?", fetchReply: true})
                    msgCollector().on("collect", async(response) => {
                         const channel = client.util.getChannel(response, response.content)?.id;
                         if(response.content.trim().toLowerCase() === "off"){
                              config.channel = undefined
                              update();
                              response.delete();
                              collected.deleteReply()
                              guildData.set("invite", {...guildData.get("invite"), join: config})
                              return;
                         }
                         if(!channel || channel.type !== 0) response.reply("Salon invalide").then((m) => {
                              setTimeout(() => (m.delete(), collected.deleteReply(), response.delete()), 3000)
                         })
                         config.channel = channel;
                         update();
                         response.delete();
                         collected.deleteReply()
                         guildData.set("invite", {...guildData.get("invite"), join: config})
                    })
               }else if(value === "message"){
                    collected.reply({content: "Quel est le message ?", fetchReply: true})
                    msgCollector().on("collect", async(response) => {
                         config.message = response.content;
                         update();
                         guildData.set("invite", {...guildData.get("invite"), join: config})
                    })
               }
          })
          function update(){
               return interaction.editReply({embeds: [embed("Join Config", config)]})
          }
         }else if(cmd === "leave"){
          const config = guildData.get("invite").leave;
          const message = await interaction.reply({embeds: [embed("Leave Config", config)], components: [menu()], fetchReply: true});
          const collector = interaction.channel.createMessageComponentCollector({
               filter: (i) => i.user.id === interaction.user.id && i.message.id === message.id,
          });
          collector.on("collect", async(collected) => {
               const value = collected.values[0];
               if(value === "channel"){
                    collected.reply({content: "Quel est le salon ?", fetchReply: true})
                    msgCollector().on("collect", async(response) => {
                         const channel = client.util.getChannel(response, response.content)?.id;
                         if(response.content.trim().toLowerCase() === "off"){
                              config.channel = undefined
                              update();
                              response.delete();
                              collected.deleteReply()
                              guildData.set("invite", {...guildData.get("invite"), leave: config})
                              return;
                         }
                         if(!channel || channel.type !== 0) response.reply("Salon invalide").then((m) => {
                              setTimeout(() => (m.delete(), collected.deleteReply(), response.delete()), 3000)
                         })
                         config.channel = channel;
                         update();
                         response.delete();
                         collected.deleteReply()
                         guildData.set("invite", {...guildData.get("invite"), leave: config})
                    })
               }else if(value === "message"){
                    collected.reply({content: "Quel est le message ?", fetchReply: true})
                    msgCollector().on("collect", async(response) => {
                         config.message = response.content;
                         update();
                         response.delete();
                         collected.deleteReply()
                         guildData.set("invite", {...guildData.get("invite"), leave: config})
                    })
               }
          })
          function update(){
               return interaction.editReply({embeds: [embed("Join Config", config)]})
          }
         }else if(cmd === "variables"){
          let embed = {
               title: "Variables Invites",
               color: guildData.get("color"),
               fields: [
                    {name: "{member}", value: "Le membre ayant quitté/rejoint"},
                    {name: "{memberName}", value: "Le pseudo du membre"},
                    {name: "{inviter}", value: "L'inviter ayant invité le membre"},
                    {name: "{inviterName}", value: "Le pseudo de l'inviter"},
                    {name: "{invitesCount}", value: "Nombre d'invites de l'inviter"},
                    {name: "{membersCount}", value: "Nombre de membres du serveur",},
               ]
          }
          interaction.reply({embeds: [embed], ephemeral: true})
         }
         function embed(title, config){
          return {
               title,
               description: "*Définissez off en salon pour désactiver*",
               fields: [
                    {name: `${client.botemojis.channel} Salon`, value: `> ${config.channel ? `<#${config.channel}>` : "Indéfini"}`},
                    {name: `💬 Message`, value: `\`${config.message || "Indéfini"}\``},
               ],
               color: guildData.get("color")
          }
         }
         function menu(){
          return new ActionRowBuilder().setComponents(
               new StringSelectMenuBuilder().setPlaceholder("lYers 📘").setCustomId("invite-menu").setOptions(
                    {
                         label: "Salon",
                         emoji: {id: client.util.getEmojiId(client.botemojis.channel)},
                         value: "channel",
                         description: "Modifier le salon"
                    },
                    {
                         label: "Message",
                         emoji: { name: "💬" },
                         value: "message",
                         description: "Modifier le message"
                    }
               )
          )
         }
         function msgCollector(){
          return interaction.channel.createMessageCollector({
               filter: (m) => m.author.id === interaction.user.id,
               max: 1
          })
         }
     }
}