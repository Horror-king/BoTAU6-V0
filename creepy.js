const axios = require('axios');

module.exports = {
    config: {
        name: "creepy",
        aliases: ['horror', 'spooky'],
        author: "Hassan",
        version: "1.0",
        shortDescription: "Get a creepy fact",
        longDescription: "Retrieve a random creepy fact to send shivers down your spine.",
        category: "fun",
        guide: {
            vi: "",
            en: ""
        }
    },

    onStart: async function ({ message }) {
        try {
            const url = 'http://numbersapi.com/random/trivia';
            message.reply('🔍 Delving into the darkness for a fact...');

            const response = await axios.get(url);
            const fact = response.data;

            return message.reply(`📜 Here's a creepy fact for you:\n\n"${fact}"`);
        } catch (error) {
            console.error(error);
            return message.reply("🚫 The shadows are being uncooperative. There was an error fetching the creepy fact.");
        }
    }
      
