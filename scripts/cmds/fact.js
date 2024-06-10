const axios = require('axios');

module.exports = {
    config: {
        name: "fact",
        aliases: ['rfact', 'uselessfact'],
        author: "Hassan",
        version: "1.0",
        shortDescription: "Get a random fact",
        longDescription: "Retrieve a random fact using Hassan's Facts API.",
        category: "fun",
        guide: {
            vi: "",
            en: ""
        }
    },

    onStart: async function ({ message }) {
        try {
            const url = 'https://hassan-fa-ct-api.onrender.com/fact';
            const response = await axios.get(url);
            const factData = response.data;

            const fact = factData.fact;

            return message.reply(`🧠 Did you know?\n\n${fact}\n\nSource: code Hassan 40.U`);
        } catch (error) {
            console.error(error);
            return message.reply("Sorry, there was an error fetching the fact.");
        }
    }
