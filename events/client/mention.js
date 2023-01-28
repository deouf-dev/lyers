module.exports = {
    name: "messageCreate",

    async run(client, message) {
        if(message.author.bot) return;
        if (message.mentions.users.has(client.user.id)) {
            message.reply({
                content: `<:hey:1058734100070006784> Je suis entièrement en Slash Commandes (\`/\`)\n> **/help**`,
            });
        }
    },
};
