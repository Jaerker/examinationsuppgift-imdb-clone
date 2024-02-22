import agent from './agent.js';
import {data, local} from './local.js';




window.addEventListener('load', () => {


    setupCarousel();
    setupMostPopularMovies();
    local.setup();
    const carouselRef = document.querySelector('#carousel');
    const carouselWrapperRef = document.querySelector('#carouselWrapper');
    const searchFormRef = document.querySelector('#searchForm');

    document.querySelector('#prev').addEventListener('click', () => {
        if(local.direction === -1){
            local.direction = 1; //Vi åker vänster i karusellen, därav åt positivt håll i translateX
            carouselRef.appendChild(carouselRef.firstElementChild);

        }
        carouselWrapperRef.style.justifyContent = 'flex-end';
        carouselRef.style.transform = 'translate(20%)';

    });

    document.querySelector('#next').addEventListener('click', () => {
        if(local.direction === 1){
            local.direction = -1; //Vi åker höger i karusellen, därav åt negativt håll i translateX
            carouselRef.prepend(carouselRef.lastElementChild);
        
        }
        carouselWrapperRef.style.justifyContent = 'flex-start';

        carouselRef.style.transform = 'translate(-20%)';


    });

    

    carouselRef.addEventListener('transitionend', () => {
        console.log(data);
        if(local.direction === -1){
            carouselRef.appendChild(carouselRef.firstElementChild);

        }
        else if(local.direction === 1){
            carouselRef.prepend(carouselRef.lastElementChild);
        }

        carouselRef.style.transition = 'none';
        carouselRef.style.transform = 'translate(0)';
        setTimeout(()=>{
            carouselRef.style.transition = 'transform .25s';
        });
    });

    searchFormRef.addEventListener('submit', (e)=>{
        e.preventDefault();
    })



});

async function setupCarousel() {

    const sliderElementRefs = document.querySelectorAll('.slider__element');
    const list = await agent.santos.list().then(res => {
        let returnValue = [];
        for(let i =0; i<5;i++){
            const randomlyChosenMovie = res[Math.floor(Math.random()*res.length)];
            if(returnValue.length === 0){
                returnValue.push(randomlyChosenMovie);
            }
            else{
                if(returnValue.some(x => x.imdbid === randomlyChosenMovie.imdbid)){
                    i--;
                }else{
                    returnValue.push(randomlyChosenMovie);
                }
            }
        }
        return returnValue;}
        );

    
    sliderElementRefs.forEach(element => {
        const movie = list.pop();

        const iFrameElement = document.createElement('iframe');
        iFrameElement.classList.add('slider__moving-pictures');
        // iFrameElement.src=movie.trailer_link; // Denna funkar också, men blir lite mindre issues med third party cookies med mitt alternativ, och jag har lite svårt för alla slags felmeddelanden
        iFrameElement.src=`${movie.trailer_link.slice(0, 19)}-nocookie${movie.trailer_link.slice(19)}`;
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
        listItemElement.classList.add('popular-movie');
        listItemElement.addEventListener('click', () => {
          //Do stuff later on
        });


        const movieTitleElement = document.createElement('h3');
        movieTitleElement.classList.add('popular-movie__title');
        movieTitleElement.textContent = movie.title.length >27 ? `${movie.title.slice(0,26)}...` : movie.title;

        const moviePosterElement = document.createElement('img');
        moviePosterElement.classList.add('popular-movie__poster');
        moviePosterElement.src = movie.poster;


        const movieDetails = await setupDetailsForMovie(movie.imdbid);

        listItemElement.append(moviePosterElement, movieTitleElement, movieDetails);

        movieListRef.appendChild(listItemElement);

    })
}
async function setupDetailsForMovie(id){
    const movieData = await agent.omdb.details(id);
    const mainStoringElement    = document.createElement('section');    
    const   containerElement      = document.createElement('section');
    const   iconElement           = document.createElement('i');
    const ratingElement         = document.createElement('p');

    mainStoringElement.classList.add('popular-movie__information');
    containerElement.classList.add('popular-movie__imdb-star-rating');
    iconElement.classList.add('popular-movie__star-icon','fa-solid','fa-star', 'fa-lg');
    ratingElement.classList.add('popular-movie__imdb-rating');
    ratingElement.textContent = movieData.imdbRating;

    containerElement.append(iconElement, ratingElement);
    mainStoringElement.append(containerElement);

    const watchlistContainerElement = document.createElement('section');
    const watchlistIconElement = document.createElement('i');
    watchlistContainerElement.classList.add('movie-button__watchlist--small', 'movie-button__watchlist');
    
    if(data.watchlist?.some(x => x.imdbID === id)){
        watchlistIconElement.classList.add('fa-solid', 'fa-minus','fa-xl','movie-button__watchlist-icon');

    }else{
        watchlistIconElement.classList.add('fa-solid', 'fa-plus','fa-xl','movie-button__watchlist-icon');

    }
    watchlistContainerElement.addEventListener('click',()=> {
        data.watchlist?.some(x => x.imdbID === id) ? local.watchlist.remove(movieData) : local.watchlist.add(movieData);
        watchlistIconElement.classList.toggle('fa-minus');        
        watchlistIconElement.classList.toggle('fa-plus');  
    });

    
    watchlistContainerElement.append(watchlistIconElement);
    mainStoringElement.append(watchlistContainerElement);

    const favouritesContainerElement = document.createElement('section');
    const favouritesIconElement = document.createElement('i');
    
    favouritesContainerElement.classList.add('movie-button__favourites');
    if(data.favourites?.some(x => x.imdbID === id)){
        favouritesIconElement.classList.add('fa-solid','fa-star','fa-xl','movie-button__favourites-icon');
    }
    else{
        favouritesIconElement.classList.add('fa-regular','fa-star','fa-xl','movie-button__favourites-icon');
    }
    favouritesContainerElement.addEventListener('click', () => {
        data.favourites?.some(x => x.imdbID === id) ? local.favourites.remove(movieData) : local.favourites.add(movieData);
        favouritesIconElement.classList.toggle('fa-solid');        
        favouritesIconElement.classList.toggle('fa-regular');        
    });
    favouritesContainerElement.append(favouritesIconElement);
    mainStoringElement.append(favouritesContainerElement);
    




    return mainStoringElement;

}