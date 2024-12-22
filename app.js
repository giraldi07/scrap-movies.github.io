const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();
const PORT = 3000;

// Fungsi untuk scraping data film
async function scrapeMovies() {
    const url = "https://tv4.idlix.asia"; // Ganti dengan URL yang sesuai
    const movies = [];

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        $('article.item.movies').each((i, element) => {
            const title = $(element).find('h3').text().trim();
            const rating = $(element).find('.rating').text().trim();
            const imageUrl = $(element).find('img').attr('src');
            const link = $(element).find('a').attr('href');

            movies.push({
                title,
                rating,
                image_url: imageUrl,
                link
            });
        });
    } catch (error) {
        console.error("Error while scraping movies:", error.message);
    }

    return movies;
}

// Endpoint untuk menampilkan data film
app.get('/', async (req, res) => {
    const movies = await scrapeMovies();

    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, html) => {
        if (err) {
            return res.status(500).send("Error loading HTML file.");
        }

        const moviesHtml = movies.map(movie => `
            <div class="movie-item">
                <div class="movie-image">
                    <img src="${movie.image_url}" alt="${movie.title}">
                </div>
                <div class="movie-details">
                    <h3>${movie.title}</h3>
                    <p>Rating: <strong>${movie.rating}</strong></p>
                    <a href="${movie.link}" class="watch-now" target="_blank">Watch Now</a>
                </div>
            </div>
        `).join('');

        const renderedHtml = html.replace('{{movies}}', moviesHtml);
        res.send(renderedHtml);
    });
});

// Menghidupkan server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
