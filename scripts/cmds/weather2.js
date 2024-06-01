const axios = require('axios');

module.exports = {
    config: {
        name: "weather2",
        aliases: ['wt'],
        author: "Hassan",
        version: "1.0",
        shortDescription: "Get current weather information",
        longDescription: "Fetches current weather information for a specified city using the OpenWeatherMap API.",
        category: "utility",
        guide: {
            vi: "",
            en: ""
        }
    },

    onStart: async function ({ args, message, getLang }) {
        try {
            const city = args.join(' ');
            if (!city) {
                return message.reply("Please provide a city name.");
            }

            const apiKey = 'ce5048473491559fe3db75ee1432b127';
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

            message.reply('⏳Fetching weather data...');

            const { data } = await axios.get(url);

            const weatherInfo = `
                🌤️ Weather in ${data.name}, ${data.sys.country}:
                - Temperature: ${data.main.temp}°C
                - Weather: ${data.weather[0].description}
                - Humidity: ${data.main.humidity}%
                - Wind Speed: ${data.wind.speed} m/s
            `;

            return message.reply(weatherInfo);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                return message.reply("City not found. Please check the city name and try again.");
            }
            return message.reply("Sorry, I couldn't fetch the weather data. Please try again later.");
        }
    }
