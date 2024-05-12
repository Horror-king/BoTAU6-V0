const axios = require('axios');

module.exports = {
    config: {
        name: "pexels",
        aliases: ['px'],
        author: "Hassan",
        version: "1.0",
        shortDescription: "Search for images using Pexels API",
        longDescription: "Search for high-quality images using Pexels API and return a specified number of results.",
        category: "utility",
        guide: {
            vi: "",
            en: ""
        }
    },

    onStart: async function ({ args, message, getLang }) {
        try {
            const query = args.join(' ');
            const numResults = parseInt(args[args.length - 1]) || 8; // Default to 8 images if no number is provided

            if (isNaN(numResults) || numResults < 1 || numResults > 50) {
                return message.reply("Please provide a number of images between 1 and 50.");
            }

            const apiKey = 'NoL8ytYlwsYIqmkLBboshW909HzoBoBnGZJbpmwAcahp5PF9TAnr9p7Z';
            const url = `https://api.pexels.com/v1/search?query=${query}&per_page=${numResults}`;

            const headers = {
                'Authorization': apiKey
            };

            message.reply('⏳Please wait...');

            const { data } = await axios.get(url, { headers });

            const results = data.photos.map(photo => photo.src.original);

            const attachments = await Promise.all(results.map(url => global.utils.getStreamFromURL(url)));

            return message.reply({ body: `✅𝑻𝑯𝑬𝑹𝑬 𝑰𝑺 𝑻𝑯𝑬 𝑷𝑬𝑿𝑬𝑳𝑺 𝑹𝑬𝑺𝑼𝑳𝑻𝑺 𝑭𝑶𝑹 𝑷𝑹𝑶𝑽𝑰𝑫𝑬𝑫 𝑷𝑹𝑶𝑴𝑷𝑻"${query}" 𝑭𝒓𝒐𝒎 𝑷𝒆𝒙𝒆𝒍𝒔:`, attachment: attachments });
        } catch (error) {
            console.error(error);
            return message.reply("Sorry, I couldn't find any results.");
        }
    }
}
