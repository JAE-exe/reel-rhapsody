const APILINK =
  "https://api.themoviedb.org/3/discover/movie?sort_by_popularity.desc&api_key=5d52e66a47126a59050f67994f26fa0e&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w500";
const SEARCHAPI =
  "https://api.themoviedb.org/3/search/movie?&api_key=5d52e66a47126a59050f67994f26fa0e&query";

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

function createRatingStars(rating) {
  const starContainer = document.createElement("div");
  starContainer.classList.add("rating-stars");

  const ratingValue = Math.round(rating / 2); // Assuming the rating is out of 10

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.innerHTML = i <= ratingValue ? "★" : "☆";
    starContainer.appendChild(star);
  }

  return starContainer;
}
// Function to create movie cards
function createMovieCard(element) {
  const div_card = document.createElement("div");
  div_card.classList.add("card");

  const image = document.createElement("img");
  image.classList.add("thumbnail");
  image.src = IMG_PATH + element.poster_path;

  const title = document.createElement("h3");
  title.innerHTML = `${element.title}`;

  const summary = document.createElement("p");
  summary.classList.add("summary");
  summary.innerHTML = `${element.overview}`;

  const rating = document.createElement("p");
  rating.innerHTML = `Rating: ${element.vote_average}`;

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("image-container");
  imageContainer.appendChild(image);

  const ratingStars = createRatingStars(element.vote_average);

  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("details-container");
  detailsContainer.appendChild(title);
  detailsContainer.appendChild(summary);

  detailsContainer.appendChild(ratingStars);

  div_card.appendChild(imageContainer);
  div_card.appendChild(detailsContainer);

  return div_card;
}

// Function to render movie cards in rows and columns
function renderMovieCards(results) {
  const row = document.createElement("div");
  row.classList.add("row");

  results.forEach((element) => {
    const column = document.createElement("div");
    column.classList.add("column");
    const card = createMovieCard(element);
    column.appendChild(card);
    row.appendChild(column);
  });

  main.appendChild(row);
}

// Function to fetch and return movies
async function returnMovies(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      renderMovieCards(data.results);
    } else {
      main.innerHTML = "No results found(API error)";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Debounce function to delay API requests
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Add an event listener for the 'input' event on the search input field
search.addEventListener(
  "input",
  debounce(async (e) => {
    const searchItem = e.target.value.trim();

    if (searchItem) {
      try {
        main.innerHTML = "";

        const searchUrl = `${SEARCHAPI}=${encodeURIComponent(searchItem)}`;
        await returnMovies(searchUrl);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      // If the search input is empty, return to the home screen
      main.innerHTML = "";
      returnMovies(APILINK);
    }
  }, 500) // Adjust the delay time (in milliseconds) as needed
);

// Keep the existing 'submit' event listener for the form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const searchItem = search.value.trim();

  if (searchItem) {
    try {
      main.innerHTML = "";

      const searchUrl = `${SEARCHAPI}=${encodeURIComponent(searchItem)}`;
      await returnMovies(searchUrl);

      // Do not clear the search input value
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
});

// Initial load of movies
returnMovies(APILINK);
