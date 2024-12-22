// script.js

document.addEventListener("DOMContentLoaded", function() {
    // Data film yang didapatkan
    const movies = [
        {
            title: "Red One (2024)",
            rating: "9.5",
            year: "2024",
            image: "https://image.tmdb.org/t/p/w185/cdqLnri3NEGcmfnqwk2TSIYtddg.jpg",
            link: "https://tv4.idlix.asia/movie/red-one-2024/"
        },
        {
            title: "Venom: The Last Dance (2024)",
            rating: "8.8",
            year: "2024",
            image: "https://image.tmdb.org/t/p/w185/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
            link: "https://tv4.idlix.asia/movie/venom-the-last-dance-2024/"
        },
        {
            title: "We Live in Time (2024)",
            rating: "9",
            year: "2024",
            image: "https://image.tmdb.org/t/p/w185/oeDNBgnlGF6rnyX1P1K8Vl2f3lW.jpg",
            link: "https://tv4.idlix.asia/movie/we-live-in-time-2024/"
        },
        {
            title: "Smile 2 (2024)",
            rating: "6.2",
            year: "2024",
            image: "https://image.tmdb.org/t/p/w185/ht8Uv9QPv9y7K0RvUyJIaXOZTfd.jpg",
            link: "https://tv4.idlix.asia/movie/smile-2-2024/"
        },
        {
            title: "Apocalypse Z: The Beginning of the End (2024)",
            rating: "8.8",
            year: "2024",
            image: "https://image.tmdb.org/t/p/w185/jaBToJ1DZcwn5wOsQeLOXFVlBLn.jpg",
            link: "https://tv4.idlix.asia/movie/apocalypse-z-the-beginning-of-the-end-2024/"
        }
    ];

    // Menampilkan data film di halaman
    const movieContainer = document.querySelector(".movie-container");

    movies.forEach(movie => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");

        movieElement.innerHTML = `
            <div class="poster">
                <img src="${movie.image}" alt="${movie.title}">
                <div class="rating">${movie.rating}</div>
            </div>
            <div class="data">
                <h3><a href="${movie.link}" target="_blank">${movie.title}</a></h3>
                <span class="year">${movie.year}</span>
            </div>
        `;

        movieContainer.appendChild(movieElement);
    });
});
