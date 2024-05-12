const axios = require('axios');

module.exports = {
  config: {
    name: "prompt",
    version: "1.0",
    author: "Samir Œ",
    shortDescription: "Generate prompt for image",
    longDescription: "Generate a prompt for animagine xl.",
    category: "Text Generation"
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");

    if (!prompt) {
      return api.sendMessage({ body: "Please provide a prompt." }, event.threadID);
    }

    try {
      const apiUrl = `https://apis-samir.onrender.com/llama3?prompt=${encodeURIComponent(prompt)}&system_prompt=you%20are%20a%20image%20prompt%20generator%20here%27s%20your%20prompt%20base%201girl/1boy,%20character%20name,%20from%20what%20series,masterpiece,safe,newest,very%20aesthetic%20don%27t%20use%20more%20then%20200%20token%20only%20give%20art%20details%20example%20blue%20hair,%20eye%20color%20clothes%20stye%20and%20so%20on`;

      const response = await axios.get(apiUrl);
      const promptText = response.data.completion;

      api.sendMessage({ body: `${promptText}` }, event.threadID);
    } catch (error) {
      console.error("Failed to generate prompt:", error.message);
      api.sendMessage({ body: "Failed to generate prompt." }, event.threadID);
    }
  }
};
