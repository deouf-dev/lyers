module.exports = {
    name: "embed",
    description: "Pannel pour crée un embed personnalisé",
    userPermissions: ["Administrator"],


    async run(client, interaction){
        return client.util.embedBuilder(interaction)
    }
}