module.exports = {
     name: "invites",
     description: "Afficher les invitations d'un utilisateur",
     options: [
          {name: "utilisateur", description: "L'utilisateur", required: false, type: 6}
     ],

     async run(client, interaction, guildData){
          const user = interaction.options.getUser("utilisateur") || interaction.user;
          const userdata = guildData.get("invites")[user.id] || {joins: 0, leaves: 0};
          let embed = {
               title: "Invites",
               description: `> 📩 Joins: ${userdata.joins}\n> \n> 📨 Parties: ${userdata.leaves}\n> \n> 🔖 Total: ${userdata.joins - userdata.leaves}`,
               color: guildData.get("color"),
          }     
          interaction.reply({embeds: [embed], ephemeral: true})
     }
}