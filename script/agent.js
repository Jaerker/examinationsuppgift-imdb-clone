import apiKey from './secretData.js';
const jespersApi = 'https://santosnr6.github.io/Data/movies.json';
const omdbApi = `http://www.omdbapi.com/?apikey=${apiKey}`;



const requests = {
    get: async (url) => await fetch(url).then(res =>  res.json()).catch((e)=>{return e.json()}),
}

const omdb = {
    search: async (searchValue, page=1) => await requests.get(`${omdbApi}&s=${searchValue.replaceAll(' ', '-')}&p=${page}`),
    details: async (movieId) => await requests.get(`${omdbApi}&plot=full&i=${movieId}`), 
}


const santos = {
    list: async () => await requests.get(jespersApi),
}

/** 
 * Remember to add a secretData.js file inside the script file with this information: 
 *      const apiKey = <YOUR-OMDB-API-KEY>;
 *      export default apiKey;
 */
const agent = {
    omdb,
    santos
}

export default agent;