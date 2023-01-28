module.exports = {
     name: "lock",
     description: "Bloquer un salon",
     options: [
          {name: "salon", required: false, description: "Le salon", type: 7}
     ],
     userPermissions: ["ManageChannels"],

     async run(client, interaction){
          const channel = interaction.options.getChannel("salon") || interaction.channel;
          channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {SendMessages: false}).then(() => {
               interaction.reply({content: "Salon bloqué"})
          }).catch((e) => {
               interaction.reply({content: "Je n'ai pas pu bloquer le salon", ephemeral: true})
          })
     }
}