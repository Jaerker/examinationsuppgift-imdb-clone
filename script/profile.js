'use strict'
import { data, local } from './local.js';


window.addEventListener('load', () => {

    local.setup();
    const profileNameRef = document.querySelector('#profileName');
    profileNameRef.textContent = data.profile.name === '' ? 'Unnamed' : data.profile.name;

    const watchlistRef = document.querySelector('#watchlist');
    const favouritesListRef = document.querySelector('#favouritesList');
    const detailsWrapperRef = document.querySelector('#detailsWrapper');
    

    detailsWrapperRef.addEventListener('click', (e) => {
        if (e.target.id === 'detailsWrapper') {
            let movieBoxRef = document.querySelector('#movieDetails').cloneNode();
            document.querySelector('#movieDetails').remove();
            detailsWrapperRef.appendChild(movieBoxRef);
            detailsWrapperRef.classList.toggle('detailed-movie__wrapper--active');
            document.querySelector('#body').classList.toggle('body--disable-scroll');

        }
    });

    data.favourites.forEach(movie => {

        const listItemElement = document.createElement('li');
        listItemElement.classList.add('movie');
        listItemElement.id = movie.imdbID;

        listItemElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('movie') || e.target.classList.contains('movie__poster')) {
                setupDetailedMovie(movie);
                document.querySelector('#detailsWrapper').classList.toggle('detailed-movie__wrapper--active');
                document.querySelector('#body').classList.toggle('body--disable-scroll');
            }
   

        });
        const movieDetails = setupMovieCard(movie);

        movieDetails.forEach(element => listItemElement.append(element));
        
        favouritesListRef.append(listItemElement);

    });
    
    data.watchlist.forEach(movie => {

        const listItemElement = document.createElement('li');
        listItemElement.classList.add('movie');
        listItemElement.id = movie.imdbID;

        listItemElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('movie') || e.target.classList.contains('movie__poster')) {
                setupDetailedMovie(movie);
                document.querySelector('#detailsWrapper').classList.toggle('detailed-movie__wrapper--active');
                document.querySelector('#body').classList.toggle('body--disable-scroll');
            }
   

        });
        const movieDetails = setupMovieCard(movie);

        movieDetails.forEach(element => listItemElement.append(element));
        
        watchlistRef.append(listItemElement);

    });
    

});
function setupDetailedMovie(movie) {
    const movieBoxRef = document.querySelector('#movieDetails');
    const movieDetails = setupMovieCard(movie, true);

    movieDetails.forEach(element => movieBoxRef.append(element));

}

function setupMovieCard(movie, detailed = false) {
    const ratingContainerElement = document.createElement('section');
    let iconElement = document.createElement('img');
    let ratingElement = document.createElement('p');



    const movieTitleElement = document.createElement('h3');
    movieTitleElement.classList.add('movie__title');
    movieTitleElement.textContent = movie.Title.length > 27 ? `${movie.Title.slice(0, 26)}...` : movie.Title;

    const moviePosterElement = document.createElement('img');
    moviePosterElement.classList.add('movie__poster');

        moviePosterElement.src = movie.Poster !== 'N/A' ? movie.Poster : '../img/poster-not-found.png';
        moviePosterElement.alt = movie.Poster !== 'N/A' ? 'image of the movie poster.' : 'image of poster not found.';    
  

    ratingContainerElement.classList.add('movie__rating-star', detailed ? 'movie__rating-star--detailed' : null);

    iconElement.classList.add('movie__star-icon');
    iconElement.src = '../img/star-solid.png';
    iconElement.alt = 'graphics of a star.';
    ratingElement.classList.add('movie__imdb-rating');
    ratingElement.textContent = movie.imdbRating;

    ratingContainerElement.append(iconElement, ratingElement);



    const watchlistContainerElement = document.createElement('section');
    watchlistContainerElement.classList.add('movie__watchlist-section');
    watchlistContainerElement.setAttribute('data-id', movie.imdbID);

    const watchlistIconContainerElement = document.createElement('section');
    const watchlistPlusIconElement = document.createElement('img');
    const watchlistMinusIconElement = document.createElement('img');
    watchlistIconContainerElement.classList.add('movie-button__watchlist', detailed ? 'movie-button__watchlist--large' : 'movie-button__watchlist--small');
    watchlistPlusIconElement.classList.add('movie-button__watchlist-icon', data.watchlist?.some(x => x.imdbID === movie.imdbID) ? 'movie-button__watchlist-icon--invisible' : null);
    watchlistPlusIconElement.src = '../img/plus-sign.png';
    watchlistPlusIconElement.alt = 'graphics of a plus sign for adding movie to watchlist.';
    watchlistMinusIconElement.classList.add('movie-button__watchlist-icon', data.watchlist?.some(x => x.imdbID === movie.imdbID) ? null : 'movie-button__watchlist-icon--invisible');
    watchlistMinusIconElement.src = '../img/minus-sign.png';
    watchlistMinusIconElement.alt = 'graphics of a minus sign.';




    watchlistContainerElement.addEventListener('click', (e) => {
        data.watchlist?.some(x => x.imdbID === movie.imdbID) ? local.watchlist.remove(movie) : local.watchlist.add(movie);


        const watchlistRef = document.querySelector('#watchlist');
        const favouritesListRef = document.querySelector('#favouritesList');


        const favouritesOriginalRef = Array.from(favouritesListRef.childNodes).find(node => node.id === watchlistContainerElement.attributes['data-id'].value);

        if(favouritesOriginalRef){
            favouritesOriginalRef.querySelectorAll('.movie-button__watchlist-icon').forEach(node => {
                node.classList.toggle('movie-button__watchlist-icon--invisible');
            });
        }
        const watchlistOriginalRef = Array.from(watchlistRef.childNodes).find(node => node.id === watchlistContainerElement.attributes['data-id'].value);
        watchlistOriginalRef.querySelectorAll('.movie-button__watchlist-icon').forEach(node => {
            node.classList.toggle('movie-button__watchlist-icon--invisible');
        });
        if (detailed) {
            watchlistContainerElement.querySelectorAll('.movie-button__watchlist-icon').forEach(node => {
                node.classList.toggle('movie-button__watchlist-icon--invisible');
            });
            watchlistContainerElement.querySelector('.movie-button__watchlist-label').textContent = data.watchlist?.some(x => x.imdbID === movie.imdbID) ? 'Remove from wishlist' : 'Add to wishlist';
        }
    });


    watchlistIconContainerElement.append(watchlistMinusIconElement, watchlistPlusIconElement);
    watchlistContainerElement.append(watchlistIconContainerElement);
    if (detailed) {
        const watchlistTextElement = document.createElement('p');
        watchlistTextElement.textContent = data.watchlist?.some(x => x.imdbID === movie.imdbID) ? 'Remove from wishlist' : 'Add to wishlist';
        watchlistTextElement.classList.add('movie-button__watchlist-label');
        watchlistIconContainerElement.append(watchlistTextElement);
    }

    const favouritesContainerElement = document.createElement('section');
    const favouritesOutlineIconElement = document.createElement('img');
    const favouritesSolidIconElement = document.createElement('img');

    favouritesContainerElement.classList.add('movie-button__favourites');
    favouritesContainerElement.setAttribute('data-id', movie.imdbID);
    favouritesOutlineIconElement.classList.add('movie-button__favourites-icon', 'movie-button__favourites-icon--outline');
    favouritesOutlineIconElement.src = '../img/star-outline.png';
    favouritesOutlineIconElement.alt = 'graphics of the outline of a star.';

    favouritesSolidIconElement.classList.add('movie-button__favourites-icon', 'movie-button__favourites-icon--solid', data.favourites?.some(x => x.imdbID === movie.imdbID) ? null : 'movie-button__favourites-icon--isNotInFavourites');
    favouritesSolidIconElement.src = '../img/star-solid.png';
    favouritesSolidIconElement.alt = 'graphics of a star.';



    favouritesContainerElement.addEventListener('click', (e) => {
        data.favourites?.some(x => x.imdbID === movie.imdbID) ? local.favourites.remove(movie) : local.favourites.add(movie);


        const watchlistRef = document.querySelector('#watchlist');
        const favouritesListRef = document.querySelector('#favouritesList');


        const favouritesListOriginalRef = Array.from(favouritesListRef.childNodes).find(node => node.id === favouritesContainerElement.attributes['data-id'].value);
        favouritesListOriginalRef.querySelector('.movie-button__favourites-icon--solid').classList.toggle('movie-button__favourites-icon--isNotInFavourites');

        const watchlistOriginalRef = Array.from(watchlistRef.childNodes).find(node => node.id === favouritesContainerElement.attributes['data-id'].value);

        if(watchlistOriginalRef){
            watchlistOriginalRef.querySelector('.movie-button__favourites-icon--solid').classList.toggle('movie-button__favourites-icon--isNotInFavourites');

        }


    });
    favouritesContainerElement.append(favouritesSolidIconElement, favouritesOutlineIconElement);

    if (detailed) {
        const informationBeneathPosterElement = document.createElement('ul');
        informationBeneathPosterElement.classList.add('detailed-movie__info-beneath-poster');
        informationBeneathPosterElement.append(movieTitleElement);

        informationBeneathPosterElement.append(
            createDetailedListItem('Released: ', movie.Released),
            createDetailedListItem('Runtime: ', movie.Runtime));

        const informationNextToPosterElement = document.createElement('ul');
        informationNextToPosterElement.classList.add('detailed-movie__info-next-to-poster');
        informationNextToPosterElement.append(createDetailedListItem('Ratings'));
        movie.Ratings.forEach(rate => informationNextToPosterElement.append(createDetailedListItem(rate.Source + ': ', rate.Value)))
        informationNextToPosterElement.append(createDetailedListItem('Actors'));
        const actors = movie.Actors.split(', ');
        actors.forEach(actor => informationNextToPosterElement.append(createDetailedListItem(null, actor)));

        iconElement = document.createElement('img');
        ratingElement = document.createElement('p');

        const plotSectionElement = document.createElement('section');
        plotSectionElement.classList.add('plot-section');
        if (!movie.Actors.includes('.')) {
            const plot = movie.Plot.split('.');
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
            plotParagraphElement.textContent = movie.Plot;
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