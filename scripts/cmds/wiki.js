const axios = require('axios');

module.exports = {
    config: {
        name: "wiki",
        aliases: ['hi'],
        author: "Hassan",
        version: "1.0",
        shortDescription: "Search Wikipedia for a summary",
        longDescription: "Fetch a summary of a Wikipedia article based on the search term.",
        category: "utility",
        guide: {
            vi: "",
            en: ""
        }
    },

    onStart: async function ({ args, message, getLang }) {
        try {
            const searchTerm = args.join(' ');
            if (!searchTerm) {
                return message.reply("Please provide a search term.");
            }

            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`;

            message.reply('⏳Searching Wikipedia...');

            const response = await axios.get(url);

            if (response.data && response.data.extract) {
                const summary = response.data.extract;
                const pageUrl = response.data.content_urls.desktop.page;
                return message.reply(`📚 Wikipedia summary for "${searchTerm}":\n\n${summary}\n\nRead more: ${pageUrl}`);
            } else {
                return message.reply("Sorry, no information was found for your search term.");
            }
        } catch (error) {
            console.error(error);
            return message.reply("Sorry, there was an error searching Wikipedia.");
        }
    }
                  
