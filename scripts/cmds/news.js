const axios = require('axios');

module.exports = {
    config: {
        name: "news",
        aliases: ['nws'],
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
            const query = args.join(' ') || 'latest';
            const apiKey = '73b780144b2a4feb933d1c9436a2b989';
            const url = `https://newsapi.org/v2/top-headlines?q=${query}&apiKey=${apiKey}`;

            message.reply('⏳Fetching news...');

            const { data } = await axios.get(url);

            if (data.articles.length === 0) {
                return message.reply("No news articles found for your query.");
            }

            const newsArticles = data.articles.slice(0, 5).map((article, index) => (
                `${index + 1}. ${article.title} (${article.source.name}) - ${article.url}`
            )).join('\n\n');

            return message.reply(`📰 Here are the top news headlines:\n\n${newsArticles}`);
        } catch (error) {
            console.error(error);
            return message.reply("Sorry, I couldn't fetch the news articles.");
        }
    }
