module.exports = {
     name: "list",
     description: "Commandes list",
     userPermissions: ["Administrator"],
     options: [
          {name: "admins", description: "Lister les administrateurs sur le serveur", type: 1},
          {name: "bots", description: "Lister les bots sur le serveur", type: 1}
     ],

     async run(client, interaction, guildData){
          const cmd = interaction.options.getSubcommand();
          if(cmd === "admins"){
               const admins = await interaction.guild.members.fetch().then((m) => m.filter(_m => _m.permissions.has("Administrator")))
               let embed = {
                    title: "Listes des administrateurs",
                    description: admins.map((m) => m).join("\n"),
                    color: guildData.get("color")
               }
               interaction.reply({embeds: [embed], ephemeral: true})
          }else if(cmd === "bots"){
               const bots = await interaction.guild.members.fetch().then((m) => m.filter((_m) => _m.user.bot))
               let embed = {
                    title: "Listes des bots",
                    description: bots.map((m) => m).join("\n"),
                    color: guildData.get("color")
               }
               interaction.reply({embeds: [embed], ephemeral: true})
          }
     }
}