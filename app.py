import time
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
            video_url = movie.find('a')['href']  # Ganti dengan cara ambil video URL jika tersedia

            # Tambahkan logika untuk elemen 'owl-item'
            # Asumsi: 'owl-item' adalah elemen yang berada di sekitar elemen movie
            owl_item = movie.find_parent('div', class_='owl-item')  # Menemukan parent dengan class 'owl-item'
            category = None
            if owl_item:
                category = owl_item.get_text(strip=True)  # Ambil teks kategori, jika ada

            movies.append({
                'title': title,
                'rating': rating,
                'image_url': image_url,
                'link': link,
                'video_url': video_url,  # Menyimpan URL video langsung
                'category': category  # Menyimpan kategori dari 'owl-item'
            })

    
    return movies

@app.route('/')
def home():
    movies = scrape_movies()  # Ambil data film
    return render_template('index.html', movies=movies)

if __name__ == "__main__":
    app.run(debug=True)
