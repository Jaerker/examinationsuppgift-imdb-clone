import apiKey from './secretData.js';
const jespersApi = 'https://santosnr6.github.io/Data/movies.json';
const omdbApi = `http://www.omdbapi.com/?apikey=${apiKey}&`;


/**
 * Börjat använda mig av detta upplägget om jag gör en API uppkoppling, just för att simplifiera vissa steg som blir 
 * repeterande kod. 
 * 
 */


const requests = {
    get: async (url) => await fetch(url).then(res => {return res.json()}).catch((e)=>{return e.json()}),
}

const omdb = {
    search: async (searchValue, page=1) => await requests.get(`${omdbApi}&s=${searchValue}&p=${page}`),
    details: async (movieId) => await requests.get(`${omdbApi}&i=${movieId}&plot=full`), 
}


const santos = {
    list: async () => await requests.get(jespersApi),
}


const agent = {
    omdb,
    santos
}

export default agent;