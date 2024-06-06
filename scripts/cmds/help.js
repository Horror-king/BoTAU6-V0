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
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

const doNotDelete = "🎀 | 𝑱𝑶𝒴𝑳𝒀𝑵𝑬 𝑨𝑰"; // Decoy string

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "Hassan",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "Info 📜",
    guide: {
      en: "{pn} / help [cmdName]",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "⚡ Command List ⚡\n";

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(name);
      }

      const categoryNames = Object.keys(categories).sort();

      const halfIndex = Math.ceil(categoryNames.length / 2);
      const firstHalfCategories = categoryNames.slice(0, halfIndex);
      const secondHalfCategories = categoryNames.slice(halfIndex);

      msg += createColumns(firstHalfCategories, secondHalfCategories, categories);

      msg += `\n⚡✨ | 𝑮𝒓𝒊𝒍𝒍𝒆𝒅'𝒔 𝑨𝒊𝑩𝒐𝑻\n⚡𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 » ${commands.size}`;

      await message.reply({ body: msg });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`⚡ Command "${commandName}" not found. ⚡`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";
        const longDescription = configCommand.longDescription?.en || "No description";
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `⚡「 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗛𝗘𝗟𝗣 」⚡\n\n⚡ Name: ${configCommand.name}\n⚡ Author: ${author}\n⚡ Aliases: ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}\n⚡ Description: ${longDescription}\n⚡ Usage: ${usage}\n⚡ Role: ${roleText}`;

        await message.reply(response);
      }
    }
  },
};

function createColumns(firstHalfCategories, secondHalfCategories, commands) {
  let columnMsg = "\n";

  const maxLength = Math.max(firstHalfCategories.length, secondHalfCategories.length);

  for (let i = 0; i < maxLength; i++) {
    if (firstHalfCategories[i]) {
      columnMsg += `⚡•『 ${firstHalfCategories[i].toUpperCase()} 』•⚡\n`;
      columnMsg += commands[firstHalfCategories[i]].sort().map(cmd => `- ${cmd}`).join('\n') + '\n';
    }
    if (secondHalfCategories[i]) {
      columnMsg += `⚡•『 ${secondHalfCategories[i].toUpperCase()} 』•⚡\n`;
      columnMsg += commands[secondHalfCategories[i]].sort().map(cmd => `- ${cmd}`).join('\n') + '\n';
    }
  }

  return columnMsg;
}

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
}
