const { commands, aliases } = global.GoatBot;
const { getPrefix } = global.utils;

module.exports = {
    config: {
        name: "help",
        version: "1.0",
        author: "Hassan",
        countDown: 5,
        role: 0,
        shortDescription: "Interactive command help menu",
        longDescription: "Provides an interactive menu to explore commands and get detailed info",
        category: "Info 📜",
        guide: "{pn}"
    },

    onStart: async function ({ message, args, api, event }) {
        const { threadID, senderID } = event;
        const prefix = getPrefix(threadID);
        const imageUrl = "https://tinyurl.com/26je7o6c";  // Replace this with the actual URL of your image

        if (args.length === 0) {
            let categories = {};

            commands.forEach((cmd, name) => {
                if (cmd.config.role <= 0) { // Only show commands accessible by all users
                    const category = cmd.config.category || "Uncategorized";
                    if (!categories[category]) categories[category] = [];
                    categories[category].push(name);
                }
            });

            let categoryList = "Command Categories:\n\n";
            Object.keys(categories).forEach(category => {
                categoryList += `• ${category}\n`;
            });
            categoryList += `\nReply with the name of a category to see its commands.`;

            const messageID = await api.sendMessage({
                body: categoryList,
                attachment: await global.utils.getStreamFromURL(imageUrl)
            }, threadID, async (error, info) => {
                global.client.onReply.set(info.messageID, {
                    author: senderID,
                    type: "chooseCategory",
                    categories
                });
            });
        } else {
            const commandName = args[0].toLowerCase();
            const command = commands.get(commandName) || commands.get(aliases.get(commandName));

            if (!command) {
                return message.reply(`Command "${commandName}" not found.`);
            }

            const { config } = command;
            const details = `Command: ${config.name}\n` +
                `Version: ${config.version}\n` +
                `Author: ${config.author}\n` +
                `Description: ${config.shortDescription}\n` +
                `Category: ${config.category}\n` +
                `Usage: ${config.guide.replace(/{pn}/g, prefix + config.name)}\n`;

            return message.reply(details);
        }
    },

    onReply: async function ({ message, event, api }) {
        const { threadID, messageID, body, senderID } = event;
        const data = global.client.onReply.get(messageID);
        const imageUrl = "https://tinyurl.com/26je7o6c";  // Replace this with the actual URL of your image

        if (data.author !== senderID) return;

        switch (data.type) {
            case "chooseCategory":
                const category = body.trim();
                const commandsInCategory = data.categories[category];

                if (!commandsInCategory) {
                    return api.sendMessage(`Category "${category}" not found. Please reply with a valid category name.`, threadID);
                }

                let commandList = `Commands in category "${category}":\n\n`;
                commandsInCategory.forEach(cmd => {
                    commandList += `• ${cmd}\n`;
                });
                commandList += `\nReply with the name of a command to see its details.`;

                api.sendMessage({
                    body: commandList,
                    attachment: await global.utils.getStreamFromURL(imageUrl)
                }, threadID, (error, info) => {
                    global.client.onReply.set(info.messageID, {
                        author: senderID,
                        type: "chooseCommand",
                        commandsInCategory
                    });
                });
                break;

            case "chooseCommand":
                const commandName = body.trim().toLowerCase();
                const command = commands.get(commandName) || commands.get(aliases.get(commandName));

                if (!command) {
                    return api.sendMessage(`Command "${commandName}" not found. Please reply with a valid command name.`, threadID);
                }

                const { config } = command;
                const details = `Command: ${config.name}\n` +
                    `Version: ${config.version}\n` +
                    `Author: ${config.author}\n` +
                    `Description: ${config.shortDescription}\n` +
                    `Category: ${config.category}\n` +
                    `Usage: ${config.guide.replace(/{pn}/g, prefix + config.name)}\n`;

                api.sendMessage({
                    body: details,
                    attachment: await global.utils.getStreamFromURL(imageUrl)
                }, threadID);
                break;

            default:
                break;
        }

        api.unsendMessage(messageID);
    }
}
