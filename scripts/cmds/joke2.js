const axios = require('axios');

module.exports = {
    config: {
        name: "joke2",
        aliases: ['jk'],
        author: "Hassan",
        version: "1.0",
        shortDescription: "Get a random joke",
        longDescription: "Fetches a random joke from the JokeAPI and displays it to the user.",
        category: "fun",
        guide: {
            vi: "",
            en: ""
        }
    },

    onStart: async function ({ message }) {
        try {
            const url = 'https://v2.jokeapi.dev/joke/Any';

            message.reply('⏳Fetching a joke...');

            const { data } = await axios.get(url);

            let joke;
            if (data.type === 'single') {
                joke = data.joke;
            } else {
                joke = `${data.setup}\n\n${data.delivery}`;
            }

            return message.reply(`😂 Here is a joke for you:\n\n${joke}`);
        } catch (error) {
            console.error(error);
            return message.reply("Sorry, I couldn't fetch a joke at the moment. Please try again later.");
        }
    }
