module.exports = {
	name: "unmute",
	description: "Unmute un membre",
	options: [
		{ name: "membre", description: "Le membre", required: true, type: 6 },
	],

	async run(client, interaction, guildData) {
          const target = interaction.guild.members.cache.get(interaction.options.getUser("membre").id)
          if(!target) return interaction.reply({content: "Membre introuvable", ephemeral: true});
          const muterole = guildData.get("muterole");
          if(!muterole) return interaction.reply({content: "Muterole indéfini, utiliser la commande /muterole pour le définir", ephemeral: true});
          target.roles.remove(muterole).then(() => {
               const targetData = client.managers.userManager.getOrCreate(target.user.id);
               const mutes = targetData.get("mutes")
               mutes[interaction.guild.id] = undefined;
               targetData.set("mutes", mutes)
               interaction.reply(`${target} a été unmute`);
               client.util.modLog(interaction.guild, `${interaction.user} a unmute ${target}`)
          }).catch((e) => {
               interaction.reply({content: `Je n'ai pas pu demute ${target}`, ephemeral: true})
          })
     },   
};
