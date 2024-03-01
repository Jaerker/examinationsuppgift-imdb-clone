



const requests = {
    get: (list)=>{

        const returnValue = JSON.parse(localStorage.getItem('data'));

        if(!list){
            return returnValue;
        }else{
            try{
                return returnValue[list];
            }catch(e){
                return e;
            }
        }
    },

    /**
     * 
     * @param {JSON} movie 
     * @param {string} array 
     * @returns either the part of the data array you ask for, or the movie that has been placed inside localstorage.
     */
    post: (movie, array) => {
        const localData = requests.get();

        if(!array){
            localData.movieDetails = movie;

            localStorage.setItem('data', JSON.stringify(localData));
            return movie;


        }
        else{

            if(!movie){
                return console.log('Error, movie not found');
            }
            localData[array].push(movie);
            
    
            localStorage.setItem('data', JSON.stringify(localData));
            return localData[array];
        }
    },
    
    del: (movie, array='favourites') => {

        const localData = requests.get();

        if(!movie || !localData[array].some(x => x.imdbID === movie.imdbID)){
            return console.log('Error, movie not found');
        }

        localData[array] = localData[array].filter(x => x.imdbID !== movie.imdbID);
        localStorage.setItem('data', JSON.stringify(localData));
        return localData[array];
    }
}

const watchlist = {
    list: () => {data.watchlist = requests.get('watchlist')},
    add: (movie)=>{data.watchlist = requests.post(movie, 'watchlist')},
    remove: (movie)=>{data.watchlist = requests.del(movie, 'watchlist')}
}

const favourites = {
    list: () => {data.favourites = requests.get('favourites')},
    add: (movie)=>{data.favourites = requests.post(movie, 'favourites')},
    remove: (movie)=>{data.favourites = requests.del(movie, 'favourites')}
}

const data = {
    profile:{
        name:'User',
        yearOfBirth:1990
    },
    favourites:[],
    watchlist:[],
    movieDetails:{}
};


const local = {
    favourites,
    watchlist,
    setup:() => {
        const localData = JSON.parse(localStorage.getItem('data'));
        if(!localData){
            localStorage.setItem('data', JSON.stringify({favourites:[],watchlist:[],profile:{name:'',yearOfBirth:1990}, movieDetails:{}}));
        }
        else{
            data.favourites = localData.favourites;
            data.watchlist = localData.watchlist;
        }
    },
    direction:-1,
    setMovieDetails: (movie) => data.movieDetails = requests.post(movie)
}

export {local, data};


