const genresEle = document.querySelector("#genres");
const searchBtnEle = document.querySelector("#playBtn");
const likeBtnEle = document.querySelector("#likeBtn");
const movieInfoEle = document.querySelector("#movieInfo");
const moviePosterEle = document.querySelector("#moviePoster");
const movieTextEle = document.querySelector("#movieText");
const likeOrDislikeBtnsEle = document.querySelector("#likeOrDislikeBtns");

let currentMovie;

//request header
const req1 = new XMLHttpRequest();
req1.withCredentials = true;
req1.open(
  "GET",
  "https://advanced-movie-search.p.rapidapi.com/genre/movie/list"
);
req1.setRequestHeader(
  "X-RapidAPI-Key",
  "59cc336e5cmsh3551b6efa5a4b5ep1992f0jsnb5e6cbed99f1"
);
req1.setRequestHeader(
  "X-RapidAPI-Host",
  "advanced-movie-search.p.rapidapi.com"
);

req1.send();

req1.addEventListener("load", () => {
  const req1Data = JSON.parse(req1.responseText);
  req1Data.genres.forEach((genre) => {
    const option = document.createElement("option");
    option.setAttribute("value", genre.name);
    option.textContent = genre.name;
    genresEle.append(option);
  });

  searchBtnEle.addEventListener("click", () => {
    currentMovie = 0;
    moviePosterEle.textContent = "";
    movieTextEle.textContent = "";

    const selectedGenre = req1Data.genres.find((genre) => {
      if (genre.name == genresEle.value) {
        return genre.id;
      }
    });

    const req2 = new XMLHttpRequest();
    req2.withCredentials = true;
    req2.open(
      "GET",
      `https://advanced-movie-search.p.rapidapi.com/discover/movie?with_genres=${selectedGenre.id}&page=1`
    );
    req2.setRequestHeader(
      "X-RapidAPI-Key",
      "59cc336e5cmsh3551b6efa5a4b5ep1992f0jsnb5e6cbed99f1"
    );
    req2.setRequestHeader(
      "X-RapidAPI-Host",
      "advanced-movie-search.p.rapidapi.com"
    );

    req2.send();

    req2.addEventListener("load", () => {
      const req2Data = JSON.parse(req2.responseText);
      const movieTitle = document.createElement("p");
      const moviePoster = document.createElement("img");
      const movieText = document.createElement("p");

      movieTitle.textContent = req2Data.results[currentMovie].original_title;
      movieTitle.setAttribute("id", "movieTitle");

      moviePoster.setAttribute(
        "src",
        req2Data.results[currentMovie].poster_path
      );

      movieText.textContent = req2Data.results[currentMovie].overview;
      movieText.setAttribute("id", "movieOverview");

      movieTextEle.insertBefore(movieTitle, movieTextEle.firstChild);
      moviePosterEle.append(moviePoster);
      movieTextEle.append(movieText);

      likeOrDislikeBtnsEle.removeAttribute("hidden");

      likeBtnEle.addEventListener("click", () => {
        currentMovie++;

        moviePosterEle.textContent = "";
        movieTextEle.textContent = "";

        const req3 = new XMLHttpRequest();
        req3.withCredentials = true;
        req3.open(
          "GET",
          `https://advanced-movie-search.p.rapidapi.com/discover/movie?with_genres=${selectedGenre.id}&page=1`
        );
        req3.setRequestHeader(
          "X-RapidAPI-Key",
          "59cc336e5cmsh3551b6efa5a4b5ep1992f0jsnb5e6cbed99f1"
        );
        req3.setRequestHeader(
          "X-RapidAPI-Host",
          "advanced-movie-search.p.rapidapi.com"
        );

        req3.send();

        req3.addEventListener("load", () => {
          const req3Data = JSON.parse(req3.responseText);

          if (currentMovie == req3Data.results.length - 1) {
            currentMovie = 0;
          }

          const movieTitle = document.createElement("p");
          const moviePoster = document.createElement("img");
          const movieText = document.createElement("p");

          movieTitle.textContent =
            req3Data.results[currentMovie].original_title;
          movieTitle.setAttribute("id", "movieTitle");

          moviePoster.setAttribute(
            "src",
            req3Data.results[currentMovie].poster_path
          );

          movieText.textContent = req3Data.results[currentMovie].overview;
          movieText.setAttribute("id", "movieOverview");

          movieTextEle.insertBefore(movieTitle, movieTextEle.firstChild);
          moviePosterEle.append(moviePoster);
          movieTextEle.append(movieText);
        });
      });
    });
  });
});
