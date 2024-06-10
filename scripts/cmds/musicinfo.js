const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "musicinfo",
        aliases: ['songinfo'],
        author: "Hassan",
        version: "1.0",
        shortDescription: "Get information about a song",
        longDescription: "Fetch detailed information about a specified song.",
        category: "utility",
        guide: {
            vi: "",
            en: ""
        }
    },

    onStart: async function ({ args, message, api, event, getLang }) {
        try {
            const query = args.join(' ');
            if (!query) {
                return api.sendMessage("Please provide a song title or artist name.", event.threadID);
            }

            await api.sendMessage("Please wait⏳", event.threadID);


            await new Promise(resolve => setTimeout(resolve, 3000));

            const musicInfoUrl = `https://hassan-music-info-api.onrender.com/musicinfo?term=${encodeURIComponent(query)}&limit=1&entity=song`;
            console.log(`Fetching music info from: ${musicInfoUrl}`);

            const response = await axios.get(musicInfoUrl);
            console.log('Music info response:', response.data);

            if (response.data && response.data.wrapperType === 'track') {
                const songData = response.data;
                const {
                    trackName,
                    artistName,
                    collectionName,
                    releaseDate,
                    primaryGenreName,
                    previewUrl,
                    artworkUrl100,
                    collectionPrice,
                    trackPrice,
                    collectionExplicitness,
                    trackExplicitness,
                    trackTimeMillis,
                    country,
                    currency,
                    contentAdvisoryRating,
                    isStreamable
                } = songData;


                const messageBody = `🎵 ••Song:•• ${trackName}\n` +
                                    `👤 ••Artist:•• ${artistName}\n` +
                                    `💿 ••Album:•• ${collectionName}\n` +
                                    `📅 ••Release Date:•• ${new Date(releaseDate).toLocaleDateString()}\n` +
                                    `🎼 ••Genre:•• ${primaryGenreName}\n` +
                                    `💵 ••Collection Price:•• ${collectionPrice} ${currency}\n` +
                                    `💵 ••Track Price:•• ${trackPrice} ${currency}\n` +
                                    `⚠️ ••Collection Explicitness:•• ${collectionExplicitness}\n` +
                                    `⚠️ ••Track Explicitness:•• ${trackExplicitness}\n` +
                                    `⏱️ ••Track Duration:•• ${(trackTimeMillis / 1000).toFixed(2)} seconds\n` +
                                    `🌍 ••Country:•• ${country}\n` +
                                    `🔞 ••Content Advisory Rating:•• ${contentAdvisoryRating}\n` +
                                    `🔊 ••Streamable:•• ${isStreamable ? 'Yes' : 'No'}\n` +
                                    `🔗 ••Preview:•• ${previewUrl}`;

                await api.sendMessage(messageBody, event.threadID);

                if (artworkUrl100) {
                    console.log(`Fetching artwork from: ${artworkUrl100}`);
                    const artworkResponse = await axios.get(artworkUrl100, { responseType: 'arraybuffer' });
                    const buffer = Buffer.from(artworkResponse.data, 'binary');
                    const imagePath = path.join(__dirname, 'artwork.jpg');
                    fs.writeFileSync(imagePath, buffer);
                    console.log('Artwork saved to:', imagePath);

                    await api.sendMessage({
                        body: '',
                        attachment: fs.createReadStream(imagePath)
                    }, event.threadID);
                } else {
                    console.log('No artwork available for this song.');
                }
            } else {
                console.log('No music information found for:', query);
                return api.sendMessage("Sorry, no information was found for the song.", event.threadID);
            }
        } catch (error) {
            console.error('Error fetching music information:', error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
            return api.sendMessage("Sorry, there was an error fetching music information.", event.threadID);
        }
    }
};
