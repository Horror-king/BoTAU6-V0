const axios = require('axios');

module.exports = {
    config: {
        name: "tinyurl",
        aliases: ['shorten'],
        author: "Hassan",
        version: "1.0",
        shortDescription: "Shorten a URL using TinyURL API",
        longDescription: "Shorten a provided URL using the TinyURL API.",
        category: "utility",
        guide: {
            vi: "",
            en: ""
        }
    },

    onStart: async function ({ args, message, getLang }) {
        try {
            const longUrl = args.join(' ');
            if (!longUrl) {
                return message.reply("Please provide a URL to shorten.");
            }

            const apiKey = 'Yi3lob3XHbdfVZjbHHuSn5n1LrqjRGeDoodK7wCF6cqdfaIc4RO8x9RvEVfN'; // Replace with your TinyURL API key
            const url = `https://api.tinyurl.com/create`;

            const headers = {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            };

            const data = {
                url: longUrl,
                domain: "tinyurl.com" // Optional, you can specify the domain if needed
            };

            message.reply('⏳Shortening URL...');

            const response = await axios.post(url, data, { headers });

            if (response.data && response.data.data && response.data.data.tiny_url) {
                const shortUrl = response.data.data.tiny_url;
                return message.reply(`✅ Here is your shortened URL: ${shortUrl}`);
            } else {
                return message.reply("Sorry, there was an error shortening the URL.");
            }
        } catch (error) {
            console.error(error);
            return message.reply("Sorry, there was an error shortening the URL.");
        }
    }
