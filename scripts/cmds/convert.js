const axios = require('axios');

module.exports = {
    config: {
        name: "convert",
        aliases: ['currency'],
        author: "Hassan",
        version: "1.0",
        shortDescription: "Convert currency using ExchangeRate-API",
        longDescription: "Convert an amount from one currency to another using the ExchangeRate-API.",
        category: "utility",
        guide: {
            vi: "",
            en: ""
        }
    },

    onStart: async function ({ args, message, getLang }) {
        try {
            const amount = parseFloat(args[0]);
            const fromCurrency = args[1].toUpperCase();
            const toCurrency = args[2].toUpperCase();

            if (isNaN(amount) || !fromCurrency || !toCurrency) {
                return message.reply("Please provide an amount and two currencies.");
            }

            const apiKey = 'ff783392f72937e0bb36c7a4';
            const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;

            message.reply('⏳Converting currency...');

            const response = await axios.get(url);

            if (response.data && response.data.conversion_result) {
                const convertedAmount = response.data.conversion_result;
                return message.reply(`✅ ${amount} ${fromCurrency} is equal to ${convertedAmount} ${toCurrency}`);
            } else {
                return message.reply("Sorry, there was an error converting the currency.");
            }
        } catch (error) {
            console.error(error);
            return message.reply("Sorry, there was an error converting the currency.");
        }
    }
