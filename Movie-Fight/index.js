const autoCompleteConfig = {
    renderOption: (movie) => {
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
        
        return `
            <img src="${imgSrc}"/> 
            ${movie.Title} (${movie.Year}) 
        `;
    },
    inputValue: (movie) => {
        return movie.Title;
    },
    fetchData: async (searchTerm) => {
        const response = await axios.get("http://www.omdbapi.com/", {
            params: {
                apiKey: "7d8ffb49",
                s: searchTerm
            }
        });

        if(response.data.Error) {
            return [];
        }

        return response.data.Search;
    }
};

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector("#left-autocomplete"),
    onOptionSelected: (movie) => {
        document.querySelector(".tutorial").classList.add("is-hidden");
        
        onMovieSelect(movie, document.querySelector("#left-summary"), "left");
    },
});

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector("#right-autocomplete"),
    onOptionSelected: (movie) => {
        document.querySelector(".tutorial").classList.add("is-hidden");
        
        onMovieSelect(movie, document.querySelector("#right-summary"), "right");
    },
});

let leftMovie, rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apiKey: "7d8ffb49",
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data);  

    if(side === "left") {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    // If both of them are defined (Summary of both movies are being displayed)
    if(leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll("#left-summary .notification");
    const rightSideStats = document.querySelectorAll("#right-summary .notification");

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = leftStat.dataset.value;
        const rightSideValue = rightStat.dataset.value;

        if(rightSideValue > leftSideValue) {
            leftStat.classList.remove("is-primary");
            leftStat.classList.add("is-warning");
        } else {
            rightStat.classList.remove("is-primary");
            rightStat.classList.add("is-warning");
        }
    });
};

const movieTemplate = movieDetail => {
    // Remove currency sign and commas
    const dollars = parseInt(movieDetail.BoxOffice.replace("/\$/g", '').replace("/,/g", ''));    
    const metaScore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace("/,/g", ''));
    
    const totalAwards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);

        if(isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);

    // We can use any dataset property by using "data-[propertyName]"
    // Later, their values can be accessesd by element.dataset.propertyName
    return `
      <article class="media">
        <figure class="media-left">
          <p class="image">
            <img src="${movieDetail.Poster}" />
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <h1>${movieDetail.Title}</h1>
            <h4>${movieDetail.Genre}</h4>
            <p>${movieDetail.Plot}</p>
          </div>
        </div>
      </article>
      <article data-value=${totalAwards} class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
      </article>
      <article data-value=${dollars} class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
      </article>
      <article data-value=${metaScore} class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
      </article>
      <article data-value=${imdbRating} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
      </article>
      <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
      </article>
    `;
};

