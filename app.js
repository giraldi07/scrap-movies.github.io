const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware untuk mengatur header keamanan
app.use((req, res, next) => {
    // Set header Permissions-Policy tanpa interest-cohort
    res.setHeader("Permissions-Policy", "fullscreen=(), geolocation=()");
    next();
});

// Middleware untuk menyajikan file statis
app.use(express.static(path.join(__dirname)));

// Fungsi untuk scraping data film
const scrapeMovies = async () => {
    const url = "https://tv4.idlix.asia"; // Ganti dengan URL yang sesuai

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const movies = [];
        $('article.item.movies').each((index, element) => {
            const title = $(element).find('h3').text().trim();
            const rating = $(element).find('div.rating').text().trim();
            const imageUrl = $(element).find('img').attr('src');
            const link = $(element).find('a').attr('href');

            movies.push({ title, rating, imageUrl, link });
        });

        return movies;
    } catch (error) {
        console.error("Error scraping movies:", error.message);
        return [];
    }
};

// Route utama untuk menyajikan halaman dengan data film
app.get('/', async (req, res) => {
    const movies = await scrapeMovies();
    res.sendFile(path.join(__dirname, 'index.html'), { movies });
});

// Ekspor halaman statis dengan data film
const exportStaticSite = async () => {
    const movies = await scrapeMovies();
    const templatePath = path.join(__dirname, 'index.html');
    const outputPath = path.join(__dirname, 'static_site/index.html');

    let template = fs.readFileSync(templatePath, 'utf8');

    // Inject data film ke dalam template HTML
    const movieItems = movies.map(movie => `
        <div class="movie-item">
            <div class="movie-image">
                <img src="${movie.imageUrl}" alt="${movie.title}">
            </div>
            <div class="movie-details">
                <h3>${movie.title}</h3>
                <p>Rating: <strong>${movie.rating}</strong></p>
                <a href="${movie.link}" class="watch-now" target="_blank">Watch Now</a>
            </div>
        </div>
    `).join('');

    template = template.replace('{% for movie in movies %}', movieItems);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, template, 'utf8');
    console.log(`Static site exported to ${outputPath}`);
};

// Jalankan server dan ekspor halaman statis
app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    await exportStaticSite();
});
