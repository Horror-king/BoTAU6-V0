const fetch = require('node-fetch');
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');
const { Buffer } = require('buffer');

module.exports = {
    config: {
        name: "gemini",
        aliases: ['ai', 'genai'],
        author: "Hassan",
        version: "1.0",
        shortDescription: "Generate text using Gemini AI",
        longDescription: "Generate lyrics or other text content based on a given prompt using Gemini AI.",
        category: "utility",
        guide: {
            vi: "",
            en: ""
        }
    },

    onStart: async function ({ args, message, getLang }) {
        try {
            const prompt = args.join(' ');
            if (!prompt) {
                return message.reply("Please provide a prompt for the AI to generate text.");
            }

            const API_KEY = 'AIzaSyB4XGZJ359gmhdaSmk8dL93uXEzd9spJw8';
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro-latest" });

            // Generate text using the Gemini AI model
            const response = await model.generate({
                prompt: prompt,
                max_tokens: 200
            });

            if (response && response.text) {
                const generatedText = response.text;

                // Truncate the message if it's too long
                if (generatedText.length > 2000) {
                    return message.reply(generatedText.substring(0, 2000) + '... [Text truncated]');
                }

                return message.reply(generatedText);
            } else {
                return message.reply("Sorry, no text was generated.");
            }
        } catch (error) {
            console.error(error);
            return message.reply("Sorry, there was an error generating the text.");
        }
    }
}
