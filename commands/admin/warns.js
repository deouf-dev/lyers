module.exports = {
     name: "warns",
     description: "Commandes warns",
     options: [
          {name: "list", description: "Lister les warns d'un utilisateur sur le serveur", type: 1, options: [{name: "utilisateur", description: "L'utilisateur", required: true, type: 6}]},
          {name: "clear", description: "Supprimer les warns d'un utilisateur sur le serveur", type: 1, options: [{name: "utilisateur", description: "L'utilisateur", required: true, type: 6}]}
     ],
     userPermissions: ["Administrator"],


     async run(client, interaction, guildData){
          const target = interaction.options.getUser("utilisateur");
          const targetData = client.managers.userManager.getOrCreate(target.id);
          const warns = targetData.get("warns")[interaction.guild.id] || [];
          const cmd = interaction.options.getSubcommand();
          if(cmd === "list"){
               let embed = {
                    title: `Warns: ${target.username}#${target.discriminator}`,
                    color: guildData.get("color"),
                    description: warns.map((w) => `${w.type.charAt(0).toUpperCase() + w.type.slice(1)}: ${w.reason} - <t:${w.timestamp}:d>`).join("\n") || "Aucun"
               }
               interaction.reply({embeds: [embed], ephemeral: true})
          }else if(cmd === "clear"){
               warns[interaction.guild.id] = undefined;
               targetData.set("warns", warns);
               interaction.reply({content: `Tous les warns de ${target} ont été éffacé`})
          }
     }
}