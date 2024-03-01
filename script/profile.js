'use strict'
import {createDetailedListItem, setupDetailedMovie, setupMovieCard} from './functions.js';
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
            const movieBoxRef = document.querySelector('#movieDetails').cloneNode();
            document.querySelector('#movieDetails').remove();
            detailsWrapperRef.append(movieBoxRef);
            detailsWrapperRef.classList.toggle('detailed-movie__wrapper--active');
            document.querySelector('#body').classList.toggle('body--disable-scroll');

        }
    });

    data.favourites.forEach(async (movie) => {


        const listItemElement = document.createElement('li');
        listItemElement.classList.add('movie');
        listItemElement.id = movie.imdbID;

        listItemElement.addEventListener('click', async (e) => {
            if (e.target.classList.contains('movie') || e.target.classList.contains('movie__poster')) {
                await setupDetailedMovie(movie);
                document.querySelector('#detailsWrapper').classList.toggle('detailed-movie__wrapper--active');
                document.querySelector('#body').classList.toggle('body--disable-scroll');
            }
   

        });
        const movieDetails = await setupMovieCard(movie);

        movieDetails.forEach(element => listItemElement.append(element));
        
        favouritesListRef.append(listItemElement);

    });
    
    data.watchlist.forEach(async (movie) => {

        const listItemElement = document.createElement('li');
        listItemElement.classList.add('movie');
        listItemElement.id = movie.imdbID;

        listItemElement.addEventListener('click', async (e) => {
            if (e.target.classList.contains('movie') || e.target.classList.contains('movie__poster')) {
                await setupDetailedMovie(movie);
                document.querySelector('#detailsWrapper').classList.toggle('detailed-movie__wrapper--active');
                document.querySelector('#body').classList.toggle('body--disable-scroll');
            }
   

        });
        const movieDetails = await setupMovieCard(movie);

        movieDetails.forEach(element => listItemElement.append(element));
        
        watchlistRef.append(listItemElement);

    });
    

});

