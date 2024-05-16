module.exports = {

  config: {

    name: 'botteam',

    version: '1.0',

    author: 'Hassan',

    shortDescription: '',

    category: 'fun',

    guide: '{pn}',

  },

  onStart: async function ({ message }) {

    return message.reply('1. Zenith nova\n2. Hassan John\n3. Gold Grilled\n4. Amiya\n5. Miku');

  }

}
