const axios = require('axios');

const Prefixes = [
  'ai',
  'AI',
  'Ai'
];

module.exports = {
  config: {
    name: 'ai',
    version: '2.6.2',
    author: 'JV Barcenas | Shikaki', // do not change
    role: 0,
    category: 'ai',
    shortDescription: {
      en: 'Asks gemini AI for an answer.',
    },
    longDescription: {
      en: 'Asks gemini AI for an answer based on the user prompt.',
    },
    guide: {
      en: '{pn} [prompt]',
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {
      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));

      if (!prefix) {
        return; 
      }

      const prompt = event.body.substring(prefix.length).trim();

      if (prompt === '') {
        await message.reply(
          "Kindly provide the question at your convenience and I shall strive to deliver an effective response. Your satisfaction is my top priority."
        );
        return;
      }

      api.setMessageReaction("⌛", event.messageID, () => { }, true);

      let updatedPrompt = `Follow as written: Mostly answer in 1 word or 1 sentene. For any affirmation to your answers only yes or no. Answer in 1-2 sentences for generic questions and longer for complex questions. Mostly stick to 1 sentences unless asked long answers. Now: ${prompt}`;

      const response = await axios.get(`https://pi.aliestercrowley.com/api?prompt=${encodeURIComponent(updatedPrompt)}&uid=${event.senderID}`);

      if (response.status !== 200 || !response.data) {
        throw new Error('Invalid or missing response from API');
      }

      const messageText = response.data.response;

      await message.reply(messageText);

      api.setMessageReaction("✅", event.messageID, () => { }, true);
    } catch (error) {
      message.reply(`Failed to get answer: ${error.message}`);
    }
  },
}
