const axios = require('axios');

module.exports = {
  config: {
    name: 'weather2',
    aliases: ['wthr', 'forecast'],
    author: 'Hassan',
    version: '1.0',
    shortDescription: 'Get weather information for a city',
    longDescription: 'Fetch and display weather information for a specified city.',
    category: 'utility',
    guide: {
      vi: '',
      en: '',
    },
  },

  onStart: async function ({ args, message, getLang }) {
    try {
      const cityName = args.join(' ');
      if (!cityName) {
        return message.reply('Please provide a city name.');
      }

      const url = `https://nodejs-2-jrqi.onrender.com/weather?city=${encodeURIComponent(cityName)}`;

      const response = await axios.get(url);

      if (response.data) {
        const weatherData = response.data;
        const city = weatherData.name;
        const country = weatherData.sys.country;
        const temperature = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed;

        const messageBody =
          `🌆 **City:** ${city}, ${country}\n` +
          `🌡️ **Temperature:** ${temperature}°C\n` +
          `☁️ **Weather:** ${weatherDescription}\n` +
          `💧 **Humidity:** ${humidity}%\n` +
          `🌬️ **Wind Speed:** ${windSpeed} m/s`;

        return message.reply(messageBody);
      } else {
        return message.reply('Sorry, no weather information was found for the specified city.');
      }
    } catch (error) {
      console.error(error);
      return message.reply('Sorry, there was an error fetching weather information.');
    }
  },
};
