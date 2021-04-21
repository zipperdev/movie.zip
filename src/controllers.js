import request, { get } from "request";
import routes from "./routes"
require("dotenv").config();

export const home = (req, res) => {
    request({
        encoding: "utf-8", 
        method: "GET", 
        uri: "https://api.themoviedb.org/3/movie/popular?api_key=7633a8bbbc602917153dc162e10ee81a"
    }, function(err, _, html) {
        if (err) {
            return res.render("error", { pageTitle: "500 Error" });
        } else {
            const pMovies = JSON.parse(html);
            request({
                encoding: "utf-8", 
                method: "GET", 
                uri: "https://api.themoviedb.org/3/tv/popular?api_key=7633a8bbbc602917153dc162e10ee81a"
            }, function(err, _, html) {
                if (err) {
                    return res.render("error", { pageTitle: "500 Error" });
                } else {
                    const pTvShows = JSON.parse(html);
                    request({
                        encoding: "utf-8", 
                        method: "GET", 
                        uri: "https://api.themoviedb.org/3/trending/movies/day?api_key=7633a8bbbc602917153dc162e10ee81a"
                    }, function(err, _, html) {
                        if (err) {
                            return res.render("error", { pageTitle: "500 Error" });
                        } else {
                            const tMovies = JSON.parse(html);
                            request({
                                encoding: "utf-8", 
                                method: "GET", 
                                uri: "https://api.themoviedb.org/3/trending/tv/day?api_key=7633a8bbbc602917153dc162e10ee81a"
                            }, function(err, _, html) {
                                if (err) {
                                    return res.render("error", { pageTitle: "500 Error" });
                                } else {
                                    const tTvShows = JSON.parse(html);
                                    return res.render("home", {
                                        pageTitle: "Home", 
                                        pMovies: pMovies.results, 
                                        pTvs: pTvShows.results, 
                                        tMovies: tMovies.results, 
                                        tTvs: tTvShows.results, 
                                    });
                                };
                            });
                        };
                    });
                };
            });
        };
    });
};

export const movieDetail = (req, res) => {
    const { id } = req.params;
    request({
        encoding: "utf-8", 
        method: "GET", 
        uri: `https://api.themoviedb.org/3/movie/${id}?api_key=7633a8bbbc602917153dc162e10ee81a`
    }, function(err, _, html) {
        if (err) {
            return res.render("error", { pageTitle: "500 Error" });
        } else {
            const movie = JSON.parse(html);
            if (movie.success === false) {
                return res.render("error", { pageTitle: "500 Error" });
            } else {
                return res.render("videoDetail", { pageTitle: `${movie.title || movie.name}`, video: movie });
            };
        };
    });
};

export const tvShowDetail = (req, res) => {
    const { id } = req.params;
    request({
        encoding: "utf-8", 
        method: "GET", 
        uri: `https://api.themoviedb.org/3/tv/${id}?api_key=7633a8bbbc602917153dc162e10ee81a`
    }, function(err, _, html) {
        if (err) {
            return res.render("error", { pageTitle: "500 Error" });
        } else {
            const tvShow = JSON.parse(html);
            if (tvShow.success === false) {
                return res.render("error", { pageTitle: "500 Error" });
            } else {
                return res.render("videoDetail", { pageTitle: `${tvShow.title || tvShow.name}`, video: tvShow });
            };
        };
    });
};

export const seasonDetail = (req, res) => {
    const { tvShow, season } = req.params;
    request({
        encoding: "utf-8", 
        method: "GET", 
        uri: `https://api.themoviedb.org/3/tv/${tvShow}?api_key=7633a8bbbc602917153dc162e10ee81a`
    }, function(err, _, html) {
        if (err) {
            return res.render("error", { pageTitle: "500 Error" });
        } else {
            const parsedTvShow = JSON.parse(html);
            if (tvShow.success === false) {
                return res.render("error", { pageTitle: "500 Error" });
            } else {
                request({
                    encoding: "utf-8", 
                    method: "GET", 
                    uri: `https://api.themoviedb.org/3/tv/${tvShow}/season/${season}?api_key=7633a8bbbc602917153dc162e10ee81a`
                }, function(err, _, html) {
                    if (err) {
                        return res.render("error", { pageTitle: "500 Error", });
                    } else {
                        const season = JSON.parse(html);
                        if (season.success === false) {
                            return res.render("error", { pageTitle: "500 Error" });
                        } else {
                            return res.render("seasonsDetail", { pageTitle: `${parsedTvShow.name || parsedTvShows.title || '"Unknown"'} : Season ${season}`, season, tvShowId: tvShow, tvShow: parsedTvShow });
                        };
                    };
                });
            };
        };
    });
};

export const episodeDetail = (req, res) => {
    const { tvShow, season, episode } = req.params;
    request({
        encoding: "utf-8", 
        method: "GET", 
        uri: `https://api.themoviedb.org/3/tv/${tvShow}/season/${season}/episode/${episode}?api_key=7633a8bbbc602917153dc162e10ee81a`
    }, function(err, _, html) {
        if (err) {
            return res.render("error", { pageTitle: "500 Error" });
        } else {
            const parsedEpisode = JSON.parse(html);
            if (parsedEpisode.success === false) {
                return res.render("error", { pageTitle: "500 Error" });
            } else {
                return res.render("episodeDetail", { pageTitle: `Season ${season} Episode ${episode}`, episode: parsedEpisode });
            };
        };
    });
};

export const search = (req, res) => {
    const { keyword } = req.query;
    let movies;
    let tvShows;
    if (keyword.match(/\w/g)) {
        request({
            encoding: "utf-8", 
            method: "GET", 
            uri: `https://api.themoviedb.org/3/search/movie?api_key=7633a8bbbc602917153dc162e10ee81a&query=${keyword}&page=1`
        }, function(err, _, html) {
            if (err) {
                return res.render("error", { pageTitle: "500 Error" });
            } else {
                movies = JSON.parse(html).results;
                request({
                    encoding: "utf-8", 
                    method: "GET", 
                    uri: `https://api.themoviedb.org/3/search/tv?api_key=7633a8bbbc602917153dc162e10ee81a&query=${keyword}&page=1`
                }, function(err, _, html) {
                    tvShows = JSON.parse(html).results;
                    request({
                        encoding: "utf-8", 
                        method: "GET", 
                        uri: `https://api.themoviedb.org/3/search/movie?api_key=7633a8bbbc602917153dc162e10ee81a&query=${keyword}&page=2`
                    }, function(err, _, html) {
                        if (err) {
                            return res.render("error", { pageTitle: "500 Error" });
                        } else {
                            const twoMovies = JSON.parse(html).results;
                            movies = movies.concat(twoMovies);
                            request({
                                encoding: "utf-8", 
                                method: "GET", 
                                uri: `https://api.themoviedb.org/3/search/tv?api_key=7633a8bbbc602917153dc162e10ee81a&query=${keyword}&page=2`
                            }, function(err, _, html) {
                                const twoTvShows = JSON.parse(html).results;
                                tvShows = tvShows.concat(twoTvShows);
                                return res.render("search", {
                                    pageTitle: "Search", 
                                    movies, 
                                    tvs: tvShows
                                });
                            });
                        };
                    });
                });
            };
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