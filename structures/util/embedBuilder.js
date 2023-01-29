const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder } = require("@discordjs/builders"),
    {resolveColor} = require("discord.js")

module.exports = async (client, interaction) => {
    const embed = new EmbedBuilder({description: "~~\n~~"})
    let channel = interaction.channel;
    const row = new ActionRowBuilder().setComponents(
        new SelectMenuBuilder().setCustomId("embedbuilder-menu").setPlaceholder("lYers 📘").addOptions(
            {
                label: "Titre",
                description: "Modifier le titre",
                value: "title",
                emoji: { name: "✏" },
            },
            {
                label: "Description",
                description: "Modifier la description",
                value: "desc",
                emoji: { name: "📝" },
            },
            {
                label: "Image",
                description: "Modifier l'image",
                value: "image",
                emoji: { name: "🖼️" },
            },
            {
                label: "Miniature",
                description: "Modifier la miniature",
                value: "thumbnail",
                emoji: { name: "🔖" },
            },
            {
                label: "Couleur",
                description: "Modifier la couleur",
                value: "color",
                emoji: { name: "🎨" },
            },
            {
                label: "Auteur",
                description: "Modifier l'auteur",
                value: "author",
                emoji: { name: "🔺" },
            },
            {
                label: "Footer",
                description: "Modifier le footer",
                value: "footer",
                emoji: { name: "🔻" },
            },
            {
                label: "Ajouter un field",
                description: "Ajouter un field",
                value: "add-field",
                emoji: { name: "➕" },
            },
            {
                label: "Supprimer un field",
                description: "Supprimer un field",
                value: "del-field",
                emoji: { name: "➖" },
            },
            {
                label: "Salon",
                description: "Modifier le salon",
                value: "channel",
                emoji: { name: "📍" },
            },
            {
                label: "Envoyer",
                description: "Envoye l'embed",
                value: "send",
                emoji: { name: "✅" },
            }
        )
    );
    const embedMessage = await interaction.reply({
        embeds: [embed],
        components: [row],
        content: `Salon: ${channel}`,
        fetchReply: true,
    });

    const collector = interaction.channel.createMessageComponentCollector({
        filter: (i) =>
            i.user.id === interaction.user.id && i.message.id === embedMessage.id,
    });
    const updateEmbedMessage = () => {
        embedMessage.edit({ embeds: [embed], content: `Salon: ${channel}` });
    };
    const replyAndDelete = (content, toReply, replied) => {
        toReply.reply(content).then(async (e) => {
            e.delete();
            replied.delete();
            toReply.delete();
            updateEmbedMessage();
        });
    };
    collector.on("collect", async (collected) => {
        const messageCollector = () => interaction.channel.createMessageCollector({
            filter: (m) => m.author.id === interaction.user.id,
            max: 1,
        });
        const v = collected.values[0];
        collected.deferUpdate();
        switch (v) {
            case "title":
                replied = await collected.message.reply("Quel est le titre ?");
                messageCollector().on("collect", (mes) => {
                    embed.setTitle(mes.content);
                    updateEmbedMessage();
                    mes.delete();
                    replied.delete();
                });
                break;
            case "desc":
                replied = await collected.message.reply("Quel est la description ?");
                messageCollector().on("collect", (mes) => {
                    embed.setDescription(mes.content);
                    updateEmbedMessage();
                    mes.delete();
                    replied.delete();
                });
                break;
            case "image":
                replied = await collected.message.reply(
                    "Quel est l'image ? (fichier/lien)"
                );
                messageCollector().on("collect", (mes) => {
                    const image = mes.content || mes.attachments.first()?.attachment;
                    if (!image.includes("http"))
                        return replyAndDelete("Image invalide", mes, replied);
                    embed.setImage(image);
                    updateEmbedMessage();
                    mes.delete();
                    replied.delete();
                });
                break;
            case "thumbnail":
                replied = await collected.message.reply(
                    "Quel est la miniature ? (fichier/lien)"
                );
                messageCollector().on("collect", (mes) => {
                    const image = mes.content || mes.attachments.first()?.attachment;
                    if (!image.includes("http"))
                        return replyAndDelete("Miniature invalide", mes, replied);
                    embed.setThumbnail(image);
                    updateEmbedMessage();
                    mes.delete();
                    replied.delete();
                });
                break;
            case "color":
                replied = await collected.message.reply("Quel est la couleur ?");
                messageCollector().on("collect", (mes) => {
                    try {
                        embed.setColor(resolveColor(mes.content));
                        updateEmbedMessage();
                        mes.delete();
                        replied.delete();
                    } catch (e) {
                        replyAndDelete("Une erreur est survenue", mes, replied);
                    }
                });
                break;
            case "author":
                replied = await collected.message.reply(
                    "Quel est l'auteur ? (si vous souhaitez ajoutez une icone séparez l'auteur et l'icone par `,,`)"
                );
                messageCollector().on("collect", (mes) => {
                    const args = mes.content.split(",,");
                    try {
                        embed.setAuthor({
                            name: args[0],
                            iconURL: args[1].replace(" ", ""),
                        });
                        updateEmbedMessage();
                        mes.delete();
                        replied.delete();
                    } catch (e) {
                        replyAndDelete("Une erreur est survenue", mes, replied);
                    }
                });
                break;

            case "footer":
                replied = await collected.message.reply(
                    "Quel est le footer ? (si vous souhaitez ajoutez une icone séparez le footer et l'icone par `,,`)"
                );
                messageCollector().on("collect", (mes) => {
                    const args = mes.content.split(",,");
                    try {
                        embed.setFooter({
                            text: args[0],
                            iconURL: args[1].replace(" ", ""),
                        });
                        updateEmbedMessage();
                        mes.delete();
                        replied.delete();
                    } catch (e) {
                        replyAndDelete("Une erreur est survenue", mes, replied);
                    }
                });
                break;
            case "add-field":
                replied = await collected.message.reply(
                    "Quel est le field ?\nExemple: `Titre du field ,, Texte du field ,, (sur la ligne:) oui/non `"
                );
                messageCollector().on("collect", (mes) => {
                    const args = mes.content.split(",,");
                    let inline = false;
                    if (!args[0] || !args[1] || !args[2])
                        return replyAndDelete("Données manquantes", mes, replied);
                    switch (args[2].replace(" ", "").toLowerCase()) {
                        case "oui":
                            inline = true;
                            break;
                        case "non":
                            inline = false;
                            break;
                    }
                    try {
                        embed.addFields({
                            name: `${args[0]}`,
                            value: args[1],
                            inline,
                        });
                        updateEmbedMessage();
                        mes.delete();
                        replied.delete();
                    } catch (e) {
                        replyAndDelete("Une erreur est survenue", mes, replied);
                    }
                });
                break;
            case "del-field":
                if (!embed.data.fields)
                    return collected.message
                        .reply("Il n'y a aucun field")
                        .then(async (r) => {
                            setTimeout(() => (r.delete(), updateEmbedMessage()), 3000)
                        });
                replied = await collected.message.reply(
                    "Quel est le numéro du field ?"
                );
                messageCollector().on("collect", (mes) => {
                    let fieldNumber = mes.content;
                    fieldNumber--;
                    if (isNaN(fieldNumber) || fieldNumber > embed.data.fields.length)
                        return replyAndDelete("Numéro invalide", mes, replied);
                    const newFields = [];
                    for (const f in embed.data.fields) {
                        if (f.toString() !== fieldNumber.toString().replace(" ", ""))
                            newFields.push(embed.data.fields[f]);
                    }

                    embed.setFields(newFields);
                    mes.delete();
                    replied.delete();
                    updateEmbedMessage();
                });
                break;
            case "channel":
                replied = await collected.message.reply("Quel est le salon ?");
                messageCollector().on("collect", async (mes) => {
                    const newChannel =
                       client.util.getChannel(mes, mes.content)
                    if (!channel || channel.type !== 0)
                        return replyAndDelete("Salon invalide", mes, replied);
                    channel = newChannel;
                    mes.delete();
                    replied.delete();
                    updateEmbedMessage();
                });
                break;
            case "send":
                channel
                    .send({ embeds: [embed] })
                    .then(() => {
                        collector.stop();
                        messageCollector().stop();
                        embedMessage.edit({ content: "Embed envoyé", components: [], embeds: [] });
                    })
                    .catch(async () => {
                        replied = await interaction.channel.send(
                            "Je n'ai pas pu envoyé l'embed"
                        );
                        setTimeout(() => replied.delete(), 3000)
                    });
                break;
        }
    });
};
