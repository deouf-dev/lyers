module.exports = {
     name: "unlock",
     description: "Débloquer un salon",
     options: [
          {name: "salon", required: false, description: "Le salon", type: 7}
     ],
     userPermissions: ["ManageChannels"],

     async run(client, interaction){
          const channel = interaction.options.getChannel("salon") || interaction.channel;
          channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {SendMessages: true}).then(() => {
               interaction.reply({content: "Salon débloqué"})
          }).catch((e) => {
               interaction.reply({content: "Je n'ai pas pu débloquer le salon", ephemeral: true})
          })
     }
}