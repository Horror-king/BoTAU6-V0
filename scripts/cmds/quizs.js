const axios = require('axios');

module.exports = {
  config: {
    name: "quizs",
    aliases: ['triv', 'question'],
    version: "1.0",
    author: "Hassan",
    countDown: 5,
    role: 0,
    category: "games"
  },

  onReply: async function ({ event, api, Reply, usersData, commandName }) {
    const { correctAnswer, userName, options } = Reply;
    if (event.senderID !== Reply.author) return;

    const userReply = event.body.trim().toLowerCase();
    const correctOption = Object.keys(options).find(key => options[key].toLowerCase() === correctAnswer.toLowerCase());

    if (userReply === correctAnswer.toLowerCase() || userReply === correctOption.toLowerCase()) {
      api.unsendMessage(Reply.messageID).catch(console.error);
      const rewardCoins = 100;
      const rewardExp = 10;
      const senderID = event.senderID;
      const userData = await usersData.get(senderID);

      await usersData.set(senderID, {
        ...userData,
        money: (userData.money || 0) + rewardCoins,
        exp: (userData.exp || 0) + rewardExp
      });

      const msg = {
        body: `✅ | ${userName}, your answer is correct! You have earned ${rewardCoins} coins and ${rewardExp} experience points.`
      };

      return api.sendMessage(msg, event.threadID, event.messageID);
    } else {
      api.unsendMessage(Reply.messageID);
      const msg = `❌ | ${userName}, your answer is incorrect. The correct answer is: ${correctAnswer}`;
      return api.sendMessage(msg, event.threadID);
    }
  },

  onStart: async function ({ api, event, usersData, commandName }) {
    const { threadID } = event;
    const timeout = 60;

    try {
      const response = await axios.get('https://hassan-api-space-quiz.onrender.com/space-quiz');
      const triviaData = response.data;
      const { question, correct_answer, incorrect_answers } = triviaData;

      const answers = [...incorrect_answers, correct_answer].sort(() => Math.random() - 0.5);
      const options = {
        A: answers[0],
        B: answers[1],
        C: answers[2],
        D: answers[3]
      };

      const userName = await usersData.getName(event.senderID);

      const msg = {
        body: `${question}

(A) ${options.A}
(B) ${options.B}
(C) ${options.C}
(D) ${options.D}

Reply with the correct answer or the letter option.`
      };

      api.sendMessage(msg, threadID, (error, info) => {
        if (error) {
          console.error("Error sending trivia message:", error);
          return;
        }

        if (!global.GoatBot) {
          global.GoatBot = { onReply: new Map() };
        }

        global.GoatBot.onReply.set(info.messageID, {
          type: "reply",
          commandName,
          author: event.senderID,
          messageID: info.messageID,
          correctAnswer: correct_answer,
          userName: userName,
          options: options
        });

        setTimeout(() => {
          api.unsendMessage(info.messageID);
        }, timeout * 1000);
      });
    } catch (error) {
      console.error("Error fetching trivia data:", error);
      api.sendMessage({ body: "🚀 Unable to retrieve trivia question at the moment. Please try again later." }, threadID);
    }
  }
};
