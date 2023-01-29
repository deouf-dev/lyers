const {RankCardBuilder} = require("discord-card-canvas")

module.exports = {
     name: "level",
     description: "Voir le niveau d'un utilisateur sur le serveur",
     options: [
          {name: "membre", description: "Le membre", type: 6}
     ],

     async run(client, interaction, guildData){
          if(!guildData.get("xp").toggle) return interaction.reply({content: "Le système d'xp n'est pas activé sur le serveur\nPour l'activer utiliser la commande /xp", ephemeral: true})
          const user = interaction.options.getUser("membre") || interaction.user;
          const userData = client.managers.userManager.getOrCreate(user.id);
          const xp = userData.get("xp")[interaction.guild.id] || {level: 1, xp: 0};
          await interaction.deferReply({fetchReply: true})
          async function getRank(){
               let returns;
               await client.util.getXpLeaderboard(interaction.guild).forEach((v, i) => {
                   if(v === user.id) returns = i;
               })
               return returns;
          }
          getRank()
          const card = await new RankCardBuilder({
               currentLvl: xp.level,
               currentXP: xp.xp,
               requiredXP: client.util.getXpForLevel(xp.level + 1),
               backgroundColor: "#5D51F1",
               requiredXPColor: "#808080",
               colorTextDefault: "#ffc0cb",
               progressBarColor: "#ffc0cb",
               avatarBackgroundColor: "#ffc0cb",
               currentXPColor: "#ffc0cb",
               currentRank: await getRank() || interaction.guild.memberCount,
               userStatus: interaction.guild.members.cache.get(user.id)?.presence.status,
               avatarImgURL: user.avatarURL().replace("webp", "png"),
               nicknameText: {content: user.username, font: "Bellota", color: "#ffc0cb"}
          }).build();
          interaction.editReply({files: [{attachment: card.toBuffer(), name: "card.png"}]})
     }
}