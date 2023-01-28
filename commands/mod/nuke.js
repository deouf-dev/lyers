module.exports = {
     name: "nuke",
     description: "Recrée le salon",
     options: [
          {name: "salon", required: false, description: "Le salon", type: 7}
     ],
     userPermissions: ["Administrator"],

     async run(client, interaction){
          const channel = interaction.options.getChannel("salon") || interaction.channel;
          channel.clone().then((c) => {
               c.send(`Salon recrée par ${interaction.user}`)
               channel.delete().catch(e => {}) 
          }).catch((e) => {
               interaction.reply({content: "Je n'ai pas pu recrée le salon"})
          })
     }
}