const {ModalBuilder, ActionRowBuilder, TextInputBuilder} = require("discord.js")

module.exports = {
     name: "report",
     description: "Envoyer un problème aux développeurs de lYers 📘",
     options: [
          {name: "image", type: 11, required: false, description: "Image du bug (recommendé pour la compréhension)"}
     ],

     async run(client, interaction){
          console.log(client)
          const image = interaction.options.getAttachment("image")
         if(interaction.user.manager.get("reportCooldown") <= Date.now()) return interaction.reply({content: `Veuillez attendre encore <t:${Math.round(interaction.user.manager.get("reportCooldown") / 1000)}:R> avant de pouvoir report un nouveau bug`});
         const modal = new ModalBuilder().setCustomId("modal-report").setTitle("Report - lYers 📘")
         .addComponents(
          new ActionRowBuilder()
          .setComponents(
               new TextInputBuilder().setCustomId("text-report").setLabel("Bug/Problème").setPlaceholder("lYers 📘").setRequired(true).setStyle("Paragraph")
          )
         )
         await interaction.showModal(modal);
         const response = await interaction.awaitModalSubmit({time: 120000});
         const text = response.fields.getTextInputValue("text-report");
         const channel = client.guilds.cache.get(process.env.SUPPORT_GUILD).channels.cache.get(process.env.BUG_CHANNEL)
         console.log(process.env.BUG_CHANNEL)
         channel.send({embeds: [
          {
               title: "Nouveau Report",
               description: `\`${text}\``,
               color: process.env.COLOR,
               image: image ? {url: image.url} : undefined
          }
         ]}).then((m) => {
          response.reply({content: `[Report](https://discord.com/channels/${process.env.SUPPORT_GUILD}/${channel.id}/${m.id}) envoyé, merci de votre contribution au bon dévloppement de lYers 📘`, ephemeral: true})
         }).catch((e) => {
          response.reply({content: `Je n'ai pas pu envoyé votre report dans le salon report de lYers 📘`})
         })
     }
}