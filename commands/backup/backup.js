const DiscordBackup = require("discord-backup");
DiscordBackup.setStorageFolder("/backups/")
module.exports = {
     name: "backup",
     description: "Commandes backup",
     options: [
          { name: "create", description: "Crée une backup du serveur", type: 1 },
          { name: "load", description: "Charger une backup", type: 1, options: [{name: "id", description: "L'identifiant de la backup", required: true, type: 3}]},
          { name: "list", description: "Lister vos backups", type: 1 },
          { name: "info", description: "Informations sur une de vos backups", type: 1, options: [{ name: "id", description: "L'identifiant de la backup", required: true, type: 3 }] },
          { name: "delete", description: "Supprimer une backup", type: 1, options: [{ name: "id", description: "L'identifiant de la backup", required: true, type: 3 }] }

     ],

     async run(client, interaction, guildData) {
          const userData = client.managers.userManager.getOrCreate(interaction.user.id);
          const backups = userData.get("backups");
          const cmd = interaction.options.getSubcommand();
          if (cmd === "create") {
               if (interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ content: "Uniquement le propriétaire du serveur peut crée une backup du serveur" })
               if (backups.length >= 5) return interaction.reply({ content: "Vous ne pouvez crée que 5 backups serveurs, veuillez supprimer une de vos backup pour en crée une nouvelle" })
               DiscordBackup.create(interaction.guild, {
                    maxMessagesPerChannel: 0,
                    doNotBackup: ["bans"],
                    jsonBeautify: false,
               }).then((backup) => {
                    userData.push("backups", backup.id);
                    let embed = {
                         title: `${backup.name}`,
                         color: guildData.get("color"),
                         fields: [
                              { name: "Salons", value: `\`\`\`\n${backup.channels.categories.map((category) => `> ${category.name}\n${category.children.map((channel) => channel.name).join("\n") || "Aucun"}`).join("\n")}\n\`\`\``, inline: true },
                              { name: "Rôles", value: `\`\`\`\n${backup.roles.map((role) => `${role.name}`).join("\n") || "Aucun"}\n\`\`\``, inline: true },
                              { name: "Emojis", value: backup.emojis.map((emoji) => `${emoji.base64}`).join(" ,") || "Aucun", inline: true }
                         ],
                         description: `Backup crée, id: \`${backup.id}\``
                    }
                    interaction.reply({ embeds: [embed] })
               }).catch(e => {
                    console.log(e)
                    interaction.reply({ content: `Je n'ai pas pu crée votre backup`, ephemeral: true })
               })
          } else if (cmd === "list") {
               const _b = [];
               await backups.forEach((id) => DiscordBackup.fetch(id).then((backup) => _b.push({name: backup.data.name, id})));
               interaction.deferReply({fetchReply: true, ephemeral: true})
               await client.util.sleep(2000)
               let embed = {
                    title: `Liste Backups`,
                    description: _b.map((v) => `${v.name} - \`${v.id}\``).join("\n") || "Aucune",
                    color: guildData.get("color")
               }
               interaction.editReply({ embeds: [embed] })
          } else if (cmd === "info") {
               const id = interaction.options.getString("id")
               if (!backups.includes(id)) return interaction.reply({ content: "Backup introuvable", ephemeral: true });
               DiscordBackup.fetch(id).then((backup) => {
                    if (!backup) return interaction.reply({ content: "Backup introuvable", ephemeral: true });

                    let embed = {
                         title: `${backup.data.name} - ${backup.id}`,
                         color: guildData.get("color"),
                         fields: [
                              { name: "Salons", value: `\`\`\`\n${backup.data.channels.categories.map((category) => `> ${category.name}\n${category.children.map((channel) => channel.name).join("\n")}`).join("\n") || "Aucun"}\n\`\`\``, inline: true },
                              { name: "Rôles", value: `\`\`\`\n${backup.data.roles.map((role) => `${role.name}`).join("\n") || "Aucun"}\n\`\`\``, inline: true },
                              { name: "Emojis", value: backup.data.emojis.map((emoji) => `${emoji.base64}`).join(" ,") || "Aucun", inline: true }
                         ],
                    }
                    interaction.reply({ embeds: [embed], ephemeral: true })
               }).catch((e) => {
                    console.log(e)
                    interaction.reply({ content: "Erreur lors de la récupération des donnés de la backup", ephemeral: true })
               })
          } else if (cmd === "delete") {
               const id = interaction.options.getString("id")
               if (!backups.includes(id)) return interaction.reply({ content: "Backup introuvable", ephemeral: true });
               const backup = await DiscordBackup.fetch(id).catch(() => {interaction.reply({ content: "Backup introuvable", ephemeral: true });})
               if (!backup) return interaction.reply({ content: "Backup introuvable", ephemeral: true });
               DiscordBackup.remove(id).then(() => {
                    interaction.reply({ content: "Backup supprimé", ephemeral: true })
               }).catch((e) => {
                    interaction.reply({ content: "Je n'ai pas pu supprimé votre backup", ephemeral: true })
               })
          }else if(cmd === "load"){
               const id = interaction.options.getString("id")
               if (!backups.includes(id)) return interaction.reply({ content: "Backup introuvable", ephemeral: true });
               const backup = await DiscordBackup.fetch(id);
               if (!backup) return interaction.reply({ content: "Backup introuvable", ephemeral: true });
               DiscordBackup.load(backup.data, interaction.guild, {clearGuildBeforeRestore: true, maxMessagesPerChannel: 0 }).then((v) => {
                    interaction.reply(`Je charge la backup: ${backup.data.name}`)
               }).catch((e) => {
                    interaction.reply("Je n'ai pas pu charger la backup")
               })
          }


     }
}