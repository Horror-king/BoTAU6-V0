const axios = require('axios');

module.exports = {
    config: {
        name: "spacenews",
        aliases: ['snws'],
        author: "Hassan",
        version: "1.0",
        shortDescription: "Get the latest news headlines",
        longDescription: "Fetch the latest news headlines using the NewsAPI.",
        category: "utility",
        guide: {
            vi: "",
            en: ""
        }
    },

    onStart: async function ({ args, message, getLang }) {
        try {
            const query = args.join(' ') || 'space';
            const url = `https://ha-ssan-news-api.onrender.com/news?q=${query}`;

            
            const { data } = await axios.get(url);

            if (data.length === 0) {
                return message.reply("No news articles found for your query.");
            }

            const newsArticles = data.slice(0, 5).map((article, index) => (
                `${index + 1}. ${article.title} (${article.source.name}) - ${article.url}`
            )).join('\n\n');

            return message.reply(`📰 Here are the top news headlines:\n\n${newsArticles}`);
        } catch (error) {
            console.error(error);
            return message.reply("Sorry, I couldn't fetch the news articles.");
        }
    }
}
