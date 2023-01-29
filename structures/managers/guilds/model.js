module.exports = {
    color: process.env.COLOR,
    bump: {
        channel: undefined,
        message: undefined,
        toggle: false,
        tags: [],
        resetAt: 0,
    },
    owners: [],
    whitelist: [],
    antiraid: {
        antibot: {
            toggle: "off",
            punish: "derank"
        },
        antiwebhook: {
            toggle: "off",
            punish: "derank"
        },
        antimassping: {
            toggle: "off",
            punish: "derank",
            limit: "3/h"
        },
        antimassban: {
            toggle: "off",
            punish: "derank",
            limit: "3/h"
        },
        antimasskick: {
            toggle: "off",
            punish: "derank",
            limit: "3/h"
        },
        antispam: {
            toggle: "off",
            punish: "derank",
            limit: "3/s"
        },
        antilink: {
            toggle: "off",
            punish: "derank",
            limit: "3/h"
        },
        antiroleCreate: {
            toggle: "off",
            punish: "derank",
        },
        antiroleDelete: {
            toggle: "off",
            punish: "derank",
        },
        antiroleUpdate: {
            toggle: "off",
            punish: "derank",
        },
        antichannelCreate: {
            toggle: "off",
            punish: "derank",
        },
        antichannelDelete: {
            toggle: "off",
            punish: "derank",
        },
        antichannelUpdate: {
            toggle: "off",
            punish: "derank",
        }
    },
    logs: {
        antiraid: undefined,
        moderation: undefined,
    },
    tickets: [],
    allTickets: [],
    soutien: {
        message: undefined,
        role: undefined,
        toggle: false,
    },
    muterole: undefined,
    invite: {
        join: {
            channel: undefined,
            message: undefined
        },
        leave: {
            channel: undefined,
            message: undefined,
        }
    },
    invites: {},
    xp: {
        xpPerMessage: 1.50,
        xpPerMinuteInVoice: 2.50,
        channel: undefined,
        toggle: false,
    }
}