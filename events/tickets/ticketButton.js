const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");

module.exports = {
     name: "interactionCreate",


     async run(client, button){
          if(button.customId !== "ticket-create") return;
          const guildData = client.managers.guildManager.getOrCreate(button.guild.id)
          const tickets = guildData.get("allTickets");
          const ticketConfig = guildData.get("tickets").find((t) => t.message === button.message.id)
          if(tickets.find((t) => t.user === button.user.id)) return button.reply({content: `Vous avez déjà un ticket ouvert <#${tickets.find((t) => t.user === button.user.id).channel}>`, ephemeral: true});
          button.guild.channels.create({
               name: `ticket-${button.user.username}`,
               permissions: {SendMessages: false, ViewChannel: false},
               parent: button.channel.parentId
          }).then((channel) => {
               channel.permissionOverwrites.edit(button.member, {ViewChannel: true, SendMessages: true})
               channel.permissionOverwrites.edit(button.guild.roles.everyone, {ViewChannel: false, SendMessages: false})
               ticketConfig?.managers.forEach((r) => channel.permissionOverwrites.edit(r, {ViewChannel: true, SendMessages: true}))
               button.reply({content: `Ticket crée: ${channel}`, ephemeral: true});
               guildData.push(`allTickets`, {user: button.user.id, channel: channel.id});
               let embed = {
                    description: `Ticket de ${button.member}\n*Pour supprimer le ticket appuyer sur le bouton 🔒*`,
                    color: guildData.get("color"),
               }
               const buttonrow = new ActionRowBuilder().setComponents(new ButtonBuilder({emoji: {name: "🔒"}, custom_id: "ticket-close", style: 4}))
               channel.send({content: `${button.member}`, embeds: [embed], components: [buttonrow]})
          }).catch((e) => {
               button.reply({content: "Je n'ai pas pu crée votre ticket", ephemeral: true})
          })
     }
}