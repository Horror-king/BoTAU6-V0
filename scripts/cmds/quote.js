const axios = require('axios');

module.exports = {
    config: {
        name: "rquote",
        aliases: ['quote', 'inspiration'],
        author: "Hassan",
        version: "1.0",
        shortDescription: "Get a random quote",
        longDescription: "Retrieve a random inspirational quote.",
        category: "fun",
        guide: {
            vi: "",
            en: ""
        }
    },

    onStart: async function ({ message }) {
        try {
            const url = 'https://hassan-api-quite.onrender.com/randomquote';
            
            const response = await axios.get(url);
            const quote = `${response.data.content} — ${response.data.author}`;

            return message.reply(`📜 Here's an inspirational quote:\n\n"${quote}"`);
        } catch (error) {
            console.error(error);
            return message.reply("🚫 Couldn't fetch a quote at the moment.");
        }
    }
	
