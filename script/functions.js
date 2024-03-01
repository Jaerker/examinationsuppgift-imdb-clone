import agent from './agent.js';
import { data, local } from './local.js';



/**
 * 
 * @param {JSON} movie information from OMDB or Santos API.
 * @param {boolean} detailed Determines if the data from the movie should be detailed or not, depending on if its a basic card or the detailed version.
 * @returns 
 */
export async function setupMovieCard(movie, detailed = false) {

    if (!movie.imdbid) {
        movie.imdbid = movie.imdbID;
        movie.title = movie.Title;
        movie.poster = movie.Poster;
    }

    const movieData = await agent.omdb.details(movie.imdbid);

    const movieTitleElement = document.createElement('h3');
    movieTitleElement.classList.add('movie__title');
    movieTitleElement.textContent = movie.title.length > 27 ? `${movie.title.slice(0, 26)}...` : movie.title;

    const moviePosterElement = document.createElement('img');
    moviePosterElement.classList.add('movie__poster');

    moviePosterElement.src = movie.poster !== 'N/A' ? movie.poster : '../img/poster-not-found.png';
    moviePosterElement.alt = movie.poster !== 'N/A' ? 'image of the movie poster.' : 'image of poster not found.';


    //IMDB RATING
    const ratingContainerElement = document.createElement('section');
    let iconElement = document.createElement('img');
    let ratingElement = document.createElement('p');

    ratingContainerElement.classList.add('movie__rating-star', detailed ? 'movie__rating-star--detailed' : null);

    iconElement.classList.add('movie__star-icon');
    iconElement.src = '../img/star-solid.png';
    iconElement.alt = 'graphics of a star.';
    ratingElement.classList.add('movie__imdb-rating');
    ratingElement.textContent = movieData.imdbRating;

    ratingContainerElement.append(iconElement, ratingElement);

    //WATCHLIST BUTTON
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


    watchlistContainerElement.addEventListener('click', () => {
        data.watchlist?.some(x => x.imdbID === movie.imdbid) ? local.watchlist.remove(movieData) : local.watchlist.add(movieData);



        //If we are at the profile page
        if (window.location.href.split('/').includes('pages')) {

            const watchlistRef = document.querySelector('#watchlist');
            const favouritesListRef = document.querySelector('#favouritesList');


            const favouritesOriginalRef = Array.from(favouritesListRef.childNodes).find(node => node.id === watchlistContainerElement.attributes['data-id'].value);

            if (favouritesOriginalRef) {
                favouritesOriginalRef.querySelectorAll('.movie-button__watchlist-icon').forEach(node => {
                    node.classList.toggle('movie-button__watchlist-icon--invisible');
                });
            }
            const watchlistOriginalRef = Array.from(watchlistRef.childNodes).find(node => node.id === watchlistContainerElement.attributes['data-id'].value);
            if (watchlistOriginalRef) {
                watchlistOriginalRef.querySelectorAll('.movie-button__watchlist-icon').forEach(node => {
                    node.classList.toggle('movie-button__watchlist-icon--invisible');
                });
            }

            if (detailed) {
                watchlistContainerElement.querySelectorAll('.movie-button__watchlist-icon').forEach(node => {
                    node.classList.toggle('movie-button__watchlist-icon--invisible');
                });
                watchlistContainerElement.querySelector('.movie-button__watchlist-label').textContent = data.watchlist?.some(x => x.imdbID === movie.imdbID) ? 'Remove from wishlist' : 'Add to wishlist';
            }
        }
        //If we are at the index page
        else {
            
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

                if (invisibleRef) {
                    invisibleRef.querySelectorAll('.movie-button__watchlist-icon').forEach(node => {
                        node.classList.toggle('movie-button__watchlist-icon--invisible');
                    });
                }
                watchlistContainerElement.querySelector('.movie-button__watchlist-label').textContent = data.watchlist?.some(x => x.imdbID === movie.imdbid) ? 'Remove from wishlist' : 'Add to wishlist';

            }
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

        //If we are at the profile page
        if (window.location.href.split('/').includes('pages')) {
            const watchlistRef = document.querySelector('#watchlist');
            const favouritesListRef = document.querySelector('#favouritesList');
    
            const favouritesListOriginalRef = Array.from(favouritesListRef.childNodes).find(node => node.id === favouritesContainerElement.attributes['data-id'].value);
            if(favouritesListOriginalRef){
                favouritesListOriginalRef.querySelector('.movie-button__favourites-icon--solid').classList.toggle('movie-button__favourites-icon--isNotInFavourites');
            }
            const watchlistOriginalRef = Array.from(watchlistRef.childNodes).find(node => node.id === favouritesContainerElement.attributes['data-id'].value);
    
            if(watchlistOriginalRef){
                watchlistOriginalRef.querySelector('.movie-button__favourites-icon--solid').classList.toggle('movie-button__favourites-icon--isNotInFavourites');
    
            }
            if(detailed){
                favouritesContainerElement.querySelector('.movie-button__favourites-icon--solid').classList.toggle('movie-button__favourites-icon--isNotInFavourites');

            }
    
    
        }
        //If we are at the index page
        else {

            favouritesSolidIconElement.classList.toggle('movie-button__favourites-icon--isNotInFavourites');
            if (document.querySelector('#popularMovies').classList.contains('popular-movies--hidden')) {
                const hiddenMovieRef = Array.from(document.querySelector('#movieList').childNodes).find(node => node.id === favouritesContainerElement.attributes['data-id'].value);
                if (hiddenMovieRef) {
                    hiddenMovieRef.querySelector('.movie-button__favourites-icon--solid').classList.toggle('movie-button__favourites-icon--isNotInFavourites');
                }

            }

            if (detailed) {
                const visibleList = document.querySelector('#popularMovies').classList.contains('popular-movies--hidden') ? '#searchResultList' : '#movieList';
                const invisibleList = document.querySelector('#popularMovies').classList.contains('popular-movies--hidden') ? '#movieList' : '#searchResultList';

                const visibleRef = Array.from(document.querySelector(visibleList).childNodes).find(node => node.id === e.target.attributes['data-id'].value);
                visibleRef.querySelector('.movie-button__favourites-icon--solid').classList.toggle('movie-button__favourites-icon--isNotInFavourites');

                const invisibleRef = Array.from(document.querySelector(invisibleList).childNodes).find(node => node.id === e.target.attributes['data-id'].value);

                if (invisibleRef) {
                    invisibleRef.querySelector('.movie-button__favourites-icon--solid').classList.toggle('movie-button__favourites-icon--isNotInFavourites');

                }

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
        //Actors like Samuel L. Jackson destroyed my code, therefore I chose to add this bit of code.
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

        moviePosterContainerElement.addEventListener('click', () => {
            moviePosterElement.classList.toggle('movie__poster--enlarged');
            moviePosterContainerElement.classList.toggle('movie__poster-container');
        });
        moviePosterContainerElement.append(moviePosterElement);

        // Go back button specifically for mobile version
        const goBackElement = document.createElement('section');
        const goBackLabelElement = document.createElement('p');
        goBackLabelElement.textContent = 'Go back';
        goBackElement.append(goBackLabelElement);
        goBackElement.classList.add('movie-button__back');
        goBackElement.addEventListener('click', () => {

            let movieBoxRef = document.querySelector('#movieDetails');
            movieBoxRef.remove();
            movieBoxRef = document.createElement('section');
            movieBoxRef.classList.add('detailed-movie__box');
            movieBoxRef.id = 'movieDetails';
            document.querySelector('#detailsWrapper').append(movieBoxRef);
            document.querySelector('#detailsWrapper').classList.toggle('detailed-movie__wrapper--active');
            document.querySelector('#body').classList.toggle('body--disable-scroll');


        });


        return [goBackElement, favouritesContainerElement, watchlistContainerElement, moviePosterContainerElement, movieTitleElement, informationBeneathPosterElement, informationNextToPosterElement, plotSectionElement];

    }


    return [favouritesContainerElement, watchlistContainerElement, ratingContainerElement, moviePosterElement, movieTitleElement];

}

/**
 * 
 * @param {JSON} movie movie object
 * 
 * Creates the details for the movie. 
 */
export async function setupDetailedMovie(movie) {
    const movieBoxRef = document.querySelector('#movieDetails');
    const movieDetails = await setupMovieCard(movie, true);

    movieDetails.forEach(element => movieBoxRef.append(element));

}

/**
 * 
 * @param {string?} name List items name
 * @param {string?} value List items value
 * @returns 
 * 
 * a <li></li> with name and value. Depending on if name or value is null, the information layout will change.
 */
export function createDetailedListItem(name = null, value = null) {
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