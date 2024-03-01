'use strict'
import agent from './agent.js';
import { local } from './local.js';
import { setupMovieCard, setupDetailedMovie } from './functions.js';




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

        element.append(iFrameElement);
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


