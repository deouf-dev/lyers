module.exports = {
     name: "clear",
     description: "Supprimer un nombre de messages",
     options: [
          {name: "messages", description: "Nombre de messages", type: 10, minValue: 1, maxValue: 99, required: true}
     ],
     userPermissions: ["ManageMessages"],

     async run(client, interaction){
          const messages = interaction.options.getNumber("messages");
          interaction.channel.bulkDelete(messages).then(() => {
               interaction.reply({content: `${messages} Message(s) supprimé(s)`})
          }).catch((e) => {
               interaction.reply({content: "Je n'ai pas pu supprimer les messages du salon", ephemeral: true})
          })
     }
}