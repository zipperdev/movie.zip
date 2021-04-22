const HOME = "/";
const SEARCH = "/search";
const MOVIE_DETAIL = "/movies/:id";
const TV_SHOW_DETAIL = "/tv-shows/:id";
const SEASON_DETAIL = "/tv-shows/:tvShow/seasons/:season";
const EPISODE_DETAIL = "/tv-shows/:tvShow/seasons/:season/episodes/:episode";
const LIBRARY = "/library";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SIGNUP = "/signup";

const routes = {
    home: HOME, 
    search: SEARCH, 
    movieDetail: (id) => {
        if (id) {
            return `/movies/${id}`;
        } else {
            return MOVIE_DETAIL;
        };
    }, 
    tvShowDetail: (id) => {
        if (id) {
            return `/tv-shows/${id}`;
        } else {
            return TV_SHOW_DETAIL;
        };
    }, 
    seasonDetail: (tvShowId, seasonNumber) => {
        if (tvShowId && seasonNumber) {
            return `/tv-shows/${tvShowId}/seasons/${seasonNumber}`;
        } else {
            return SEASON_DETAIL;
        };
    }, 
    episodeDetail: (tvShowId, seasonNumber, episodeNumber) => {
        if (tvShowId && seasonNumber && episodeNumber) {
            return `/tv-shows/${tvShowId}/seasons/${seasonNumber}/episodes/${episodeNumber}`;
        } else {
            return EPISODE_DETAIL;
        };
    }, 
    library: LIBRARY, 
    login: LOGIN, 
    logout: LOGOUT, 
    signup: SIGNUP
};

export default routes;