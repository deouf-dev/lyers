module.exports = {
     name: "ban",
     description: "Bannir un membre",
     userPermissions: ["BanMembers"],
     options: [
         {name: "membre", description: "Le membre", required: true, type: 6},
         {name: "raison", description: "La raison", required: false, type: 3},
     ],
     async run(client, interaction, guildData){
        const spammer = require("../../events/protection/antimassban").spammer;
         const target = interaction.guild.members.cache.get(interaction.options.getUser("membre").id);
         if(!target) return interaction.reply({content: "Membre introuvable", ephemeral: true});
         const reason = interaction.options.getString("raison") || "Aucune raison";
         const data = spammer.get(`${interaction.guild.id}-${interaction.user.id}`) || 0;
         const {toggle, limit} = guildData.get("antiraid").antimassban;
         if(toggle === "max" | "on" && data >= limit.split("/")[0]){
            if(toggle === "max" && !client.util.isOwner(interaction.guild, interaction.user.id)) return interaction.reply({content: `Vous avez atteint la limite de ban (${limit.split("/")[0]})`})
            if(toggle === "on" && !client.util.isOwner(interaction.guild, interaction.user.id)) return interaction.reply({content: `Vous avez atteint la limite de ban (${limit.split("/")[0]})`})
         }
         if(target.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: "Vous ne pouvez pas bannir cette utilisateur car il possède un plusieurs rôle au-dessus de vous", ephemeral: true})
         target.ban(reason).then(() => {
             interaction.reply(`${target} a été ban pour ${reason} `);
             const targetData = client.managers.userManager.getOrCreate(target.user.id);
             const warns = targetData.get("warns")
             (warns[interaction.guild.id] || []).push({type: "ban", reason})
             targetData.set("warns", warns)
             client.util.modLog(interaction.guild, `${interaction.user} a ban ${target} pour ${reason}`)
             spammer.set(`${interaction.guild.id}-${interaction.user.id}`, data + 1)
         }).catch((e) => {
             interaction.reply({content: "Une erreur est survenue lors du ban", ephemeral: true})
         })
     }
 }