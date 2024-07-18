const app = document.getElementById('app');
const movieCardsContainer = app.querySelector('.movie-cards');
const filterItems = app.querySelectorAll('.filter-item');
const apiUrl = 'https://aniwatch-api-net.vercel.app/anime/home'; // Replace with your API URL

// Function to fetch anime data from API
async function fetchAnimeData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.top10Animes;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to generate movie cards
function generateMovieCards(animes) {
    movieCardsContainer.innerHTML = ''; // Clear existing cards

    animes.forEach((anime, index) => {
        const card = document.createElement('a');
        card.classList.add('movie-card');
        card.href = `page2.html?id=${anime.id}`;
        card.style.animation = `appear 0.3s ease forwards ${index * 0.1}s`; // Apply animation delay
        card.innerHTML = `
            <div class="movie-poster">
                <img src="${anime.poster}" alt="${anime.name}">
                <img class="play-button" src="path/to/play-button.png" alt="Play button">
            </div>
            <div class="movie-info">
                <h3>${anime.name}</h3>
            </div>
        `;
        movieCardsContainer.appendChild(card);
    });
}

// Initial load of anime data
fetchAnimeData().then(animeData => {
    if (animeData) {
        const initialCategory = 'today'; // Default category to load
        generateMovieCards(animeData[initialCategory]);
    }
});

// Event listener for filter items
filterItems.forEach(item => {
    item.addEventListener('click', async function() {
        // Remove active class from all items
        filterItems.forEach(item => item.classList.remove('active'));
        // Add active class to the clicked item
        this.classList.add('active');
        // Get category from data attribute
        const category = this.getAttribute('data-category');

        // Fetch anime data again based on selected category
        const animeData = await fetchAnimeData();
        if (animeData) {
            // Apply animation on card filter
            movieCardsContainer.style.animation = 'none'; // Reset animation
            void movieCardsContainer.offsetWidth; // Trigger reflow
            movieCardsContainer.style.animation = `appear 0.3s ease forwards`; // Apply animation
            generateMovieCards(animeData[category]);
        }
    });
});
