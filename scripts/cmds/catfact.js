const axios = require('axios');

module.exports = {
    config: {
        name: "catfact",
        aliases: ['cf'],
        author: "Hassan",
        version: "1.0",
        shortDescription: "Get a random cat fact",
        longDescription: "Fetches a random cat fact from the Cat Facts API and displays it to the user.",
        category: "fun",
        guide: {
            vi: "",
            en: ""
        }
    },

    onStart: async function ({ message }) {
        try {
            const url = 'https://catfact.ninja/fact';

            message.reply('⏳Fetching a cat fact...');

            const { data } = await axios.get(url);

            return message.reply(`🐱 Here is a cat fact for you:\n\n${data.fact}`);
        } catch (error) {
            console.error(error);
            return message.reply("Sorry, I couldn't fetch a cat fact at the moment. Please try again later.");
        }
    }
