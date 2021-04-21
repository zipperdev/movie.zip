import fetch from "node-fetch";
import routes from "./routes";
require("dotenv").config();

const mainUri = "https://api.themoviedb.org/3";
const API_KEY = "7633a8bbbc602917153dc162e10ee81a";

export const home = (req, res) => {
    fetch(`${mainUri}/movie/popular?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            const pMovies = data;
            fetch(`${mainUri}/tv/popular?api_key=${API_KEY}`)
                .then((res) => res.json())
                .then((data) => {
                    const pTvShows = data;
                    fetch(`${mainUri}/trending/movies/day?api_key=${API_KEY}`)
                        .then((res) => res.json())
                        .then((data) => {
                            const tMovies = data;
                            fetch(`${mainUri}/trending/tv/day?api_key=${API_KEY}`)
                                .then((res) => res.json())
                                .then((data) => {
                                    const tTvShows = data;
                                    return res.render("home", {
                                        pageTitle: "Home", 
                                        pMovies: pMovies.results, 
                                        pTvs: pTvShows.results, 
                                        tMovies: tMovies.results, 
                                        tTvs: tTvShows.results, 
                                    });
                                }).catch((err) => {
                                    return res.render("error", { pageTitle: "500 Error" });
                                });
                        }).catch((err) => {
                            return res.render("error", { pageTitle: "500 Error" });
                        });
                }).catch((err) => {
                    return res.render("error", { pageTitle: "500 Error" });
                });
        }).catch((err) => {
            return res.render("error", { pageTitle: "500 Error" });
        });
};

export const movieDetail = (req, res) => {
    const { id } = req.params;
    fetch(`${mainUri}/movie/${id}?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            const movie = data;
            if (movie.success === false) {
                return res.render("error", { pageTitle: "500 Error" });
            } else {
                return res.render("videoDetail", { pageTitle: `${movie.title || movie.name}`, video: movie });
            };
        }).catch((err) => {
            return res.render("error", { pageTitle: "500 Error" });
        });
};

export const tvShowDetail = (req, res) => {
    const { id } = req.params;
    fetch(`${mainUri}/tv/${id}?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            const tvShow = data;
            if (tvShow.success === false) {
                return res.render("error", { pageTitle: "500 Error" });
            } else {
                return res.render("videoDetail", { pageTitle: `${tvShow.title || tvShow.name}`, video: tvShow });
            };
        }).catch((err) => {
            return res.render("error", { pageTitle: "500 Error" });
        });
};

export const seasonDetail = (req, res) => {
    const { tvShow, season } = req.params;
    fetch(`${mainUri}/tv/${tvShow}?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            const parsedTvShow = data;
            if (parsedTvShow.success === false) {
                return res.render("error", { pageTitle: "500 Error" });
            } else {
                fetch(`${mainUri}/tv/${tvShow}/season/${season}?api_key=${API_KEY}`)
                    .then((res) => res.json())
                    .then((data) => {
                        const season = data;
                        if (season.success === false) {
                            return res.render("error", { pageTitle: "500 Error" });
                        } else {
                            return res.render("seasonsDetail", { pageTitle: `${parsedTvShow.name || parsedTvShows.title || '"Unknown"'} : Season ${season}`, season, tvShowId: tvShow, tvShow: parsedTvShow });
                        };
                    }).catch((err) => {
                        return res.render("error", { pageTitle: "500 Error" });
                    });
            };
        }).catch((err) => {
            return res.render("error", { pageTitle: "500 Error" });
        });
};

export const episodeDetail = (req, res) => {
    const { tvShow, season, episode } = req.params;
    fetch(`${mainUri}/tv/${tvShow}/season/${season}/episode/${episode}?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            const parsedEpisode = data;
            if (parsedEpisode.success === false) {
                return res.render("error", { pageTitle: "500 Error" });
            } else {
                return res.render("episodeDetail", { pageTitle: `Season ${season} Episode ${episode}`, episode: parsedEpisode });
            };
        }).catch((err) => {
            return res.render("error", { pageTitle: "500 Error" });
        });
};

export const search = (req, res) => {
    const { keyword } = req.query;
    if (keyword.match(/\w/g)) {
        fetch(`${mainUri}/search/movie?api_key=${API_KEY}&query=${keyword}&page=1`)
            .then((res) => res.json())
            .then((data) => {
                let movies = data.results;
                if (data.success === false) {
                    return res.render("error", { pageTitle: "500 Error" });
                } else {
                    fetch(`${mainUri}/search/tv?api_key=${API_KEY}&query=${keyword}&page=1`)
                        .then((res) => res.json())
                        .then((data) => {
                            let tvShows = data.results;
                            if (data.success === false) {
                                return res.render("error", { pageTitle: "500 Error" });
                            } else {
                                fetch(`${mainUri}/search/movie?api_key=${API_KEY}&query=${keyword}&page=2`)
                                    .then((res) => res.json())
                                    .then((data) => {
                                        movies = movies.concat(data.results);
                                        if (data.success === false) {
                                            return res.render("error", { pageTitle: "500 Error" });
                                        } else {
                                            fetch(`${mainUri}/search/tv?api_key=${API_KEY}&query=${keyword}&page=2`)
                                                .then((res) => res.json())
                                                .then((data) => {
                                                    tvShows = tvShows.concat(data.results);
                                                    if (data.success === false) {
                                                        return res.render("error", { pageTitle: "500 Error" });
                                                    } else {
                                                        return res.render("search", {
                                                            pageTitle: "Search", 
                                                            movies, 
                                                            tvs: tvShows
                                                        });
                                                    };
                                                }).catch((err) => {
                                                    return res.render("error", { pageTitle: "500 Error" });
                                                });
                                        };
                                    }).catch((err) => {
                                        return res.render("error", { pageTitle: "500 Error" });
                                    });
                            };
                        }).catch((err) => {
                            return res.render("error", { pageTitle: "500 Error" });
                        });
                };
            }).catch((err) => {
                return res.render("error", { pageTitle: "500 Error" });
            });
    } else {
        return res.redirect(routes.home);
    }
};

export const login = (req, res) => {
    return res.render("login", { pageTitle: "Login" });
};

export const logout = (req, res) => {
    return res.send("I will logout the user");
};

export const signup = (req, res) => {
    return res.render("signup", { pageTitle: "Sign Up" });
};