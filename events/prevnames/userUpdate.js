module.exports = {
    name: "userUpdate",

    async run(client, oldUser, newUser) {
        if (
            `${oldUser.username}#${oldUser.discriminator}` ===
            `${newUser.username}#${newUser.discriminator}`
        )
            return;
        const userdata = client.managers.userManager.getOrCreate(
            oldUser.id
        );
        userdata
            .push("prevnames", {
                name: `${oldUser.username}#${oldUser.discriminator}`,
                timestamp: Math.round(Date.now() / 1000),
            })
    },
};
