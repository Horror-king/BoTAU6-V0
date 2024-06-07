const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "movie",
        aliases: ['movieinfo'],
        author: "Hassan",
        version: "1.0",
        shortDescription: "Get information about a movie",
        longDescription: "Fetch detailed information about a specified movie.",
        category: "utility",
        guide: {
            vi: "",
            en: ""
        }
    },

    onStart: async function ({ args, message, getLang }) {
        try {
            const movieTitle = args.join(' ');
            if (!movieTitle) {
                return message.reply("Please provide a movie title.");
            }

            const apiKey = '435fb551';
            const url = `http://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${apiKey}`;

            const response = await axios.get(url);

            if (response.data && response.data.Response === "True") {
                const movieData = response.data;
                const title = movieData.Title;
                const year = movieData.Year;
                const runtime = movieData.Runtime;
                const genres = movieData.Genre;
                const director = movieData.Director;
                const actors = movieData.Actors;
                const plot = movieData.Plot;
                const posterUrl = movieData.Poster;
                const backdropUrl = ''; // OMDB API does not provide backdrop URL. Adjust if using another API.

                const posterPath = path.join('/tmp', `${title.replace(/ /g, "_")}_poster.jpg`);
                const backdropPath = path.join('/tmp', `${title.replace(/ /g, "_")}_backdrop.jpg`);

                const downloadImage = async (url, filePath) => {
                    const response = await axios({
                        url,
                        responseType: 'stream',
                    });
                    return new Promise((resolve, reject) => {
                        const writer = fs.createWriteStream(filePath);
                        response.data.pipe(writer);
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                    });
                };

                const sendImage = async (url, filePath) => {
                    await downloadImage(url, filePath);
                    return message.reply({
                        body: `🎬 Movie: ${title} (${year})\n` +
                              `⏱️ Runtime: ${runtime}\n` +
                              `🎭 Genres: ${genres}\n` +
                              `🎬 Director: ${director}\n` +
                              `🎭 Actors: ${actors}\n` +
                              `⭐ IMDB Rating: ${movieData.imdbRating}\n` +
                              `📖 Plot: ${plot}\n`,
                        attachment: fs.createReadStream(filePath)
                    });
                };

                if (posterUrl && posterUrl !== 'N/A') {
                    await sendImage(posterUrl, posterPath);
                } else if (backdropUrl) {
                    await sendImage(backdropUrl, backdropPath);
                } else {
                    return message.reply(
                        `🎬 Movie: ${title} (${year})\n` +
                        `⏱️ Runtime: ${runtime}\n` +
                        `🎭 Genres: ${genres}\n` +
                        `🎬 Director: ${director}\n` +
                        `🎭 Actors: ${actors}\n` +
                        `⭐ IMDB Rating: ${movieData.imdbRating}\n` +
                        `📖 Plot: ${plot}`
                    );
                }
            } else {
                return message.reply("Sorry, no information was found for the movie.");
            }
        } catch (error) {
            console.error(error);
            return message.reply("Sorry, there was an error fetching movie information.");
        }
    }
}
