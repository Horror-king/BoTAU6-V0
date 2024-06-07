const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

const doNotDelete = "🎀 | 𝑱𝑶𝒴𝑳𝒀𝑵𝑬 𝑨𝑰"; // Decoy string

const fonts = [
  { bold: "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭", lower: "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇" },
  { bold: "𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕", lower: "𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯" },
  { bold: "𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁", lower: "𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛" },
  { bold: "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩", lower: "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃" },
];

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
      let msg = "• Command List •\n";

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

      msg += `\n• Grilled's AiBOT\n• Total Commands » ${commands.size}`;

      await message.reply({ body: msg });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`• Command "${commandName}" not found. •`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";
        const longDescription = configCommand.longDescription?.en || "No description";
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `• COMMAND HELP •\n\n• Name: ${configCommand.name}\n• Author: ${author}\n• Aliases: ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}\n• Description: ${longDescription}\n• Usage: ${usage}\n• Role: ${roleText}`;

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
      columnMsg += `• ${firstHalfCategories[i].toUpperCase()} •\n`;
      columnMsg += commands[firstHalfCategories[i]].sort().map(cmd => `- ${applyRandomFont(cmd)}`).join('\n') + '\n';
    }
    if (secondHalfCategories[i]) {
      columnMsg += `• ${secondHalfCategories[i].toUpperCase()} •\n`;
      columnMsg += commands[secondHalfCategories[i]].sort().map(cmd => `- ${applyRandomFont(cmd)}`).join('\n') + '\n';
    }
  }

  return columnMsg;
}

function applyRandomFont(text) {
  const font = fonts[Math.floor(Math.random() * fonts.length)];
  return text.split('').map(char => {
    if (char >= 'A' && char <= 'Z') {
      return font.bold[char.charCodeAt(0) - 'A'.charCodeAt(0)];
    } else if (char >= 'a' && char <= 'z') {
      return font.lower[char.charCodeAt(0) - 'a'.charCodeAt(0)];
    }
    return char;
  }).join('');
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
