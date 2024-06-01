const axios = require('axios');

module.exports = {
    config: {
        name: "chucknorris",
        aliases: ['cn'],
        author: "Hassan",
        version: "1.0",
        shortDescription: "Get a Chuck Norris joke",
        longDescription: "Fetches a random Chuck Norris joke from the Chuck Norris API and displays it to the user.",
        category: "fun",
        guide: {
            vi: "",
            en: ""
        }
    },

    onStart: async function ({ message }) {
        try {
            const joke = await getRandomChuckNorrisJoke();
            return message.reply(`😄 Here's a Chuck Norris joke for you:\n\n${joke}`);
        } catch (error) {
            console.error(error);
            return message.reply("Sorry, I couldn't fetch a Chuck Norris joke at the moment. Please try again later.");
        }
    }
}

async function getRandomChuckNorrisJoke() {
    const url = 'https://api.chucknorris.io/jokes/random';
    const { data } = await axios.get(url);
    return data.value;
}
