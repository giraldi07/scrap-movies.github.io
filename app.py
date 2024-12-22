import os
import requests
from bs4 import BeautifulSoup
from flask import Flask, render_template

app = Flask(__name__)

# Fungsi untuk scraping data film
def scrape_movies():
    url = "https://tv4.idlix.asia"  # Ganti dengan URL yang sesuai

    response = requests.get(url)
    movies = []

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        movie_items = soup.find_all('article', class_='item movies')

        for movie in movie_items:
            title = movie.find('h3').get_text(strip=True)
            rating = movie.find('div', class_='rating').get_text(strip=True)
            image_url = movie.find('img')['src']
            link = movie.find('a')['href']

            movies.append({
                'title': title,
                'rating': rating,
                'image_url': image_url,
                'link': link
            })

    return movies

@app.route('/')
def home():
    movies = scrape_movies()  # Ambil data film
    return render_template('index.html', movies=movies)

if __name__ == "__main__":
    # Ekspor halaman ke file HTML statis
    movies = scrape_movies()
    rendered_html = render_template('index.html', movies=movies)

    # Simpan file statis
    output_dir = "static_site"
    os.makedirs(output_dir, exist_ok=True)
    with open(os.path.join(output_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(rendered_html)

    print(f"Static site exported to {output_dir}/index.html")
