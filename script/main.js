'use strict'
import agent from './agent.js';
import { data, local } from './local.js';




window.addEventListener('load', () => {


    setupCarousel();
    setupMostPopularMovies();
    local.setup();
    const carouselRef = document.querySelector('#carousel');
    const carouselWrapperRef = document.querySelector('#carouselWrapper');
    const searchFormRef = document.querySelector('#searchForm');
    const detailsWrapperRef = document.querySelector('#detailsWrapper');

    const popularMoviesRef = document.querySelector('#popularMovies');
    const searchResultsRef = document.querySelector('#searchResults');
    //Allt med karusellen
    document.querySelector('#prev').addEventListener('click', () => {
        if (local.direction === -1) {
            local.direction = 1; //Vi åker vänster i karusellen, därav åt positivt håll i translateX
            carouselRef.appendChild(carouselRef.firstElementChild);

        }
        carouselWrapperRef.style.justifyContent = 'flex-end';
        carouselRef.style.transform = 'translate(20%)';

    });
    document.querySelector('#next').addEventListener('click', () => {
        if (local.direction === 1) {
            local.direction = -1; //Vi åker höger i karusellen, därav åt negativt håll i translateX
            carouselRef.prepend(carouselRef.lastElementChild);

        }
        carouselWrapperRef.style.justifyContent = 'flex-start';

        carouselRef.style.transform = 'translate(-20%)';


    });
    carouselRef.addEventListener('transitionend', () => {
        if (local.direction === -1) {
            carouselRef.appendChild(carouselRef.firstElementChild);

        }
        else if (local.direction === 1) {
            carouselRef.prepend(carouselRef.lastElementChild);
        }

        carouselRef.style.transition = 'none';
        carouselRef.style.transform = 'translate(0)';
        setTimeout(() => {
            carouselRef.style.transition = 'transform .25s';
        });
    });


    //Sök formuläret
    searchFormRef.addEventListener('input', (e) => {
        if (e.target.value === '' && popularMoviesRef.classList.contains('popular-movies--hidden')) {
            searchResultsRef.classList.add('search-results--hidden');
            setTimeout(() => {

                popularMoviesRef.classList.remove('d-none');
                searchResultsRef.classList.add('d-none');
            }, 200);
            setTimeout(() => {

                popularMoviesRef.classList.remove('popular-movies--hidden');
            }, 300);
        }
        if(searchResultsRef.lastElementChild.classList.contains('search-results__error-msg')){
            setTimeout(() => {

                searchResultsRef.lastElementChild.remove();
            }, 500);
        }

    });
    searchFormRef.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (searchFormRef.searchValue.value !== '') {

            const searchResultListElement = document.querySelector('#searchResultList').cloneNode();
            document.querySelector('#searchResultList').remove();


            popularMoviesRef.classList.add('popular-movies--hidden');
            setTimeout(() => {
                popularMoviesRef.classList.add('d-none');
                searchResultsRef.classList.remove('d-none');
            }, 200);
            setTimeout(() => {

                searchResultsRef.classList.remove('search-results--hidden');
                window.scrollTo(0, searchResultsRef.getBoundingClientRect().y);

            }, 300);

            try{
                const searchResult = await agent.omdb.search(searchFormRef.searchValue.value);
                if(!searchResult.Search){
                    throw({Message: 'Sorry, '+  searchResult.Error});
                }
                searchResult.Search.forEach(async (movie) => {
                    if (!movie.imdbid) {
                        movie.imdbid = movie.imdbID;
                        movie.title = movie.Title;
                        movie.poster = movie.Poster;
                    }
    
                    const listItemElement = document.createElement('li');
                    listItemElement.classList.add('movie');
                    listItemElement.id = movie.imdbid;
    
                    listItemElement.addEventListener('click', async (e) => {
                        if (e.target.classList.contains('movie')) {
                            await setupDetailedMovie(movie);
                            document.querySelector('#detailsWrapper').classList.toggle('detailed-movie__wrapper--active');
                            document.querySelector('#body').classList.toggle('body--disable-scroll');
                        }
    
                    });
                    
                    const movieDetails = await setupMovieCard(movie);
    
                    movieDetails.forEach(element => listItemElement.append(element));
    
                    searchResultListElement.append(listItemElement);
    
                });
            }catch(e){
                const errorMsgElement = document.createElement('h3');
                errorMsgElement.classList.add('search-results__error-msg');
                errorMsgElement.textContent = e.Message;
                searchResultListElement.append(errorMsgElement);
            }
            searchResultsRef.append(searchResultListElement);

            
        }

    });


    //Detaljerade sektionen för en film
    detailsWrapperRef.addEventListener('click', (e) => {
        if (e.target.id === 'detailsWrapper') {
            let movieBoxRef = document.querySelector('#movieDetails');
            movieBoxRef.remove();
            movieBoxRef = document.createElement('section');
            movieBoxRef.classList.add('detailed-movie__box');
            movieBoxRef.id = 'movieDetails';
            detailsWrapperRef.appendChild(movieBoxRef);
            detailsWrapperRef.classList.toggle('detailed-movie__wrapper--active');
            document.querySelector('#body').classList.toggle('body--disable-scroll');

        }
    });



});

async function setupCarousel() {

    const sliderElementRefs = document.querySelectorAll('.slider__element');
    const list = await agent.santos.list().then(res => {
        let returnValue = [];
        for (let i = 0; i < 5; i++) {
            const randomlyChosenMovie = res[Math.floor(Math.random() * res.length)];
            if (returnValue.length === 0) {
                returnValue.push(randomlyChosenMovie);
            }
            else {
                if (returnValue.some(x => x.imdbid === randomlyChosenMovie.imdbid)) {
                    i--;
                } else {
                    returnValue.push(randomlyChosenMovie);
                }
            }
        }
        return returnValue;
    }
    );


    sliderElementRefs.forEach(element => {
        const movie = list.pop();

        const iFrameElement = document.createElement('iframe');
        iFrameElement.classList.add('slider__moving-pictures');
        iFrameElement.src = movie.trailer_link;
        iFrameElement.title = movie.title;
        iFrameElement.loading = 'eager';
        iFrameElement.width = '100%';
        iFrameElement.height = '100%';
        iFrameElement.style.borderStyle = 'none';

        element.appendChild(iFrameElement);
    });

}

async function setupMostPopularMovies() {
    const movieListRef = document.querySelector('#movieList');

    const movieData = await agent.santos.list();

    movieData.forEach(async (movie) => {
        const listItemElement = document.createElement('li');
        listItemElement.classList.add('movie');
        listItemElement.id = movie.imdbid;

        listItemElement.addEventListener('click', async (e) => {
            if (e.target.classList.contains('movie') || e.target.classList.contains('movie__poster')) {
                await setupDetailedMovie(movie);
                document.querySelector('#detailsWrapper').classList.toggle('detailed-movie__wrapper--active');
                document.querySelector('#body').classList.toggle('body--disable-scroll');
            }


        });

        const movieDetails = await setupMovieCard(movie);

        movieDetails.forEach(element => listItemElement.append(element));

        movieListRef.appendChild(listItemElement);

    });
}

async function setupDetailedMovie(movie) {
    const movieBoxRef = document.querySelector('#movieDetails');
    const movieDetails = await setupMovieCard(movie, true);

    movieDetails.forEach(element => movieBoxRef.append(element));

}

async function setupMovieCard(movie, detailed = false) {
    const movieData = await agent.omdb.details(movie.imdbid);
    const ratingContainerElement = document.createElement('section');
    let iconElement = document.createElement('img');
    let ratingElement = document.createElement('p');



    const movieTitleElement = document.createElement('h3');
    movieTitleElement.classList.add('movie__title');
    movieTitleElement.textContent = movie.title.length > 27 ? `${movie.title.slice(0, 26)}...` : movie.title;

    const moviePosterElement = document.createElement('img');
    moviePosterElement.classList.add('movie__poster');

        moviePosterElement.src = movie.poster !== 'N/A' ? movie.poster : '../img/poster-not-found.png';
        moviePosterElement.alt = movie.poster !== 'N/A' ? 'image of the movie poster.' : 'image of poster not found.';    
  

    ratingContainerElement.classList.add('movie__rating-star', detailed ? 'movie__rating-star--detailed' : null);

    iconElement.classList.add('movie__star-icon');
    iconElement.src = '../img/star-solid.png';
    iconElement.alt = 'graphics of a star.';
    ratingElement.classList.add('movie__imdb-rating');
    ratingElement.textContent = movieData.imdbRating;

    ratingContainerElement.append(iconElement, ratingElement);



    const watchlistContainerElement = document.createElement('section');
    watchlistContainerElement.classList.add('movie__watchlist-section');
    watchlistContainerElement.setAttribute('data-id', movie.imdbid);

    const watchlistIconContainerElement = document.createElement('section');
    const watchlistPlusIconElement = document.createElement('img');
    const watchlistMinusIconElement = document.createElement('img');
    watchlistIconContainerElement.classList.add('movie-button__watchlist', detailed ? 'movie-button__watchlist--large' : 'movie-button__watchlist--small');
    watchlistPlusIconElement.classList.add('movie-button__watchlist-icon', data.watchlist?.some(x => x.imdbID === movie.imdbid) ? 'movie-button__watchlist-icon--invisible' : null);
    watchlistPlusIconElement.src = '../img/plus-sign.png';
    watchlistPlusIconElement.alt = 'graphics of a plus sign for adding movie to watchlist.';
    watchlistMinusIconElement.classList.add('movie-button__watchlist-icon', data.watchlist?.some(x => x.imdbID === movie.imdbid) ? null : 'movie-button__watchlist-icon--invisible');
    watchlistMinusIconElement.src = '../img/minus-sign.png';
    watchlistMinusIconElement.alt = 'graphics of a minus sign.';




    watchlistContainerElement.addEventListener('click', (e) => {
        data.watchlist?.some(x => x.imdbID === movie.imdbid) ? local.watchlist.remove(movieData) : local.watchlist.add(movieData);


        watchlistMinusIconElement.classList.toggle('movie-button__watchlist-icon--invisible');
        watchlistPlusIconElement.classList.toggle('movie-button__watchlist-icon--invisible');

        if (detailed) {

            const visibleList = document.querySelector('#popularMovies').classList.contains('popular-movies--hidden') ? '#searchResultList' : '#movieList';
            const invisibleList = document.querySelector('#popularMovies').classList.contains('popular-movies--hidden') ? '#movieList' : '#searchResultList';

            const visibleRef = Array.from(document.querySelector(visibleList).childNodes).find(node => node.id === watchlistContainerElement.attributes['data-id'].value);
            visibleRef.querySelectorAll('.movie-button__watchlist-icon').forEach(node => {
                node.classList.toggle('movie-button__watchlist-icon--invisible');
            });
            const invisibleRef = Array.from(document.querySelector(invisibleList).childNodes).find(node => node.id === watchlistContainerElement.attributes['data-id'].value);

            if(invisibleRef){
                invisibleRef.querySelectorAll('.movie-button__watchlist-icon').forEach(node => {
                    node.classList.toggle('movie-button__watchlist-icon--invisible');
                });
            }
            watchlistContainerElement.querySelector('.movie-button__watchlist-label').textContent = data.watchlist?.some(x => x.imdbID === movie.imdbid) ? 'Remove from wishlist' : 'Add to wishlist';

        }
    });


    watchlistIconContainerElement.append(watchlistMinusIconElement, watchlistPlusIconElement);
    watchlistContainerElement.append(watchlistIconContainerElement);
    if (detailed) {
        const watchlistTextElement = document.createElement('p');
        watchlistTextElement.textContent = data.watchlist?.some(x => x.imdbID === movie.imdbid) ? 'Remove from wishlist' : 'Add to wishlist';
        watchlistTextElement.classList.add('movie-button__watchlist-label');
        watchlistIconContainerElement.append(watchlistTextElement);
    }

    const favouritesContainerElement = document.createElement('section');
    const favouritesOutlineIconElement = document.createElement('img');
    const favouritesSolidIconElement = document.createElement('img');

    favouritesContainerElement.classList.add('movie-button__favourites');
    favouritesContainerElement.setAttribute('data-id', movie.imdbid);
    favouritesOutlineIconElement.classList.add('movie-button__favourites-icon', 'movie-button__favourites-icon--outline');
    favouritesOutlineIconElement.src = '../img/star-outline.png';
    favouritesOutlineIconElement.alt = 'graphics of the outline of a star.';

    favouritesSolidIconElement.classList.add('movie-button__favourites-icon', 'movie-button__favourites-icon--solid', data.favourites?.some(x => x.imdbID === movie.imdbid) ? null : 'movie-button__favourites-icon--isNotInFavourites');
    favouritesSolidIconElement.src = '../img/star-solid.png';
    favouritesSolidIconElement.alt = 'graphics of a star.';



    favouritesContainerElement.addEventListener('click', (e) => {
        data.favourites?.some(x => x.imdbID === movie.imdbid) ? local.favourites.remove(movieData) : local.favourites.add(movieData);
        favouritesSolidIconElement.classList.toggle('movie-button__favourites-icon--isNotInFavourites');
        if(document.querySelector('#popularMovies').classList.contains('popular-movies--hidden')){
            const hiddenMovieRef = Array.from(document.querySelector('#movieList').childNodes).find(node => node.id === favouritesContainerElement.attributes['data-id'].value);
            if(hiddenMovieRef){
                hiddenMovieRef.querySelector('.movie-button__favourites-icon--solid').classList.toggle('movie-button__favourites-icon--isNotInFavourites');
            }
            
        }


        if (detailed) {
            const visibleList = document.querySelector('#popularMovies').classList.contains('popular-movies--hidden') ? '#searchResultList' : '#movieList';
            const invisibleList = document.querySelector('#popularMovies').classList.contains('popular-movies--hidden') ? '#movieList' : '#searchResultList';

            const visibleRef = Array.from(document.querySelector(visibleList).childNodes).find(node => node.id === e.target.attributes['data-id'].value);
            visibleRef.querySelector('.movie-button__favourites-icon--solid').classList.toggle('movie-button__favourites-icon--isNotInFavourites');

            const invisibleRef = Array.from(document.querySelector(invisibleList).childNodes).find(node => node.id === e.target.attributes['data-id'].value);

            if(invisibleRef){
                invisibleRef.querySelector('.movie-button__favourites-icon--solid').classList.toggle('movie-button__favourites-icon--isNotInFavourites');

            }

        }

    });
    favouritesContainerElement.append(favouritesSolidIconElement, favouritesOutlineIconElement);

    if (detailed) {
        const informationBeneathPosterElement = document.createElement('ul');
        informationBeneathPosterElement.classList.add('detailed-movie__info-beneath-poster');
        informationBeneathPosterElement.append(movieTitleElement);

        informationBeneathPosterElement.append(
            createDetailedListItem('Released: ', movieData.Released),
            createDetailedListItem('Runtime: ', movieData.Runtime));

        const informationNextToPosterElement = document.createElement('ul');
        informationNextToPosterElement.classList.add('detailed-movie__info-next-to-poster');
        informationNextToPosterElement.append(createDetailedListItem('Ratings'));
        movieData.Ratings.forEach(rate => informationNextToPosterElement.append(createDetailedListItem(rate.Source + ': ', rate.Value)))
        informationNextToPosterElement.append(createDetailedListItem('Actors'));
        const actors = movieData.Actors.split(', ');
        actors.forEach(actor => informationNextToPosterElement.append(createDetailedListItem(null, actor)));

        iconElement = document.createElement('img');
        ratingElement = document.createElement('p');

        const plotSectionElement = document.createElement('section');
        plotSectionElement.classList.add('plot-section');
        if (!movieData.Actors.includes('.')) {
            const plot = movieData.Plot.split('.');
            plot.forEach(paragraph => {
                if (paragraph !== '') {

                    const plotParagraphElement = document.createElement('p');
                    plotParagraphElement.textContent = paragraph + '.';
                    plotSectionElement.append(plotParagraphElement);
                }


            });
        }
        else {
            const plotParagraphElement = document.createElement('p');
            plotParagraphElement.textContent = movieData.Plot;
            plotSectionElement.append(plotParagraphElement);
        }
        const moviePosterContainerElement = document.createElement('section');

        moviePosterContainerElement.addEventListener('click', ()=>{
            moviePosterElement.classList.toggle('movie__poster--enlarged');
            moviePosterContainerElement.classList.toggle('movie__poster-container');
        });
        moviePosterContainerElement.append(moviePosterElement);

        const goBackElement = document.createElement('section');
        const goBackLabelElement = document.createElement('p');
        goBackLabelElement.textContent = 'Go back';
        goBackElement.append(goBackLabelElement);
        goBackElement.classList.add('movie-button__back');
        goBackElement.addEventListener('click', ()=> {
            
            let movieBoxRef = document.querySelector('#movieDetails');
            movieBoxRef.remove();
            movieBoxRef = document.createElement('section');
            movieBoxRef.classList.add('detailed-movie__box');
            movieBoxRef.id = 'movieDetails';
            document.querySelector('#detailsWrapper').appendChild(movieBoxRef);
            document.querySelector('#detailsWrapper').classList.toggle('detailed-movie__wrapper--active');
            document.querySelector('#body').classList.toggle('body--disable-scroll');


        });


        return [goBackElement, favouritesContainerElement, watchlistContainerElement, moviePosterContainerElement, movieTitleElement, informationBeneathPosterElement, informationNextToPosterElement, plotSectionElement];

    }




    return [favouritesContainerElement, watchlistContainerElement, ratingContainerElement, moviePosterElement, movieTitleElement];

}

function createDetailedListItem(name = null, value = null) {
    const listElement = document.createElement('li');
    const nameElement = document.createElement('p');

    if (value === null) {
        nameElement.classList.add('list-name', 'list-name--header');

        nameElement.textContent = name;

        listElement.append(nameElement);

    }
    else if (name === null) {
        nameElement.classList.add('list-value', 'list-value--sub-value');
        nameElement.textContent = value;

        listElement.append(nameElement);
    }
    else {
        nameElement.classList.add('list-name');
        const valueElement = document.createElement('p');
        valueElement.classList.add('list-value');

        nameElement.textContent = name;
        valueElement.textContent = value;
        listElement.append(nameElement, valueElement);
    }



    return listElement;
}