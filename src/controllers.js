import fetch from "node-fetch";
import bcrypt from "bcrypt";
import routes from "./routes";
import User from "./models/User";
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
                                    return res.status(500).render("error", { pageTitle: "500 Error" });
                                });
                        }).catch((err) => {
                            return res.status(500).render("error", { pageTitle: "500 Error" });
                        });
                }).catch((err) => {
                    return res.status(500).render("error", { pageTitle: "500 Error" });
                });
        }).catch((err) => {
            return res.status(500).render("error", { pageTitle: "500 Error" });
        });
};

export const movieDetail = (req, res) => {
    const { id } = req.params;
    fetch(`${mainUri}/movie/${id}?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            const movie = data;
            if (movie.success === false) {
                return res.status(500).render("error", { pageTitle: "500 Error" });
            } else {
                return res.render("videoDetail", { pageTitle: `${movie.title || movie.name}`, video: movie });
            };
        }).catch((err) => {
            return res.status(500).render("error", { pageTitle: "500 Error" });
        });
};

export const tvShowDetail = (req, res) => {
    const { id } = req.params;
    fetch(`${mainUri}/tv/${id}?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            const tvShow = data;
            if (tvShow.success === false) {
                return res.status(500).render("error", { pageTitle: "500 Error" });
            } else {
                return res.render("videoDetail", { pageTitle: `${tvShow.title || tvShow.name}`, video: tvShow });
            };
        }).catch((err) => {
            return res.status(500).render("error", { pageTitle: "500 Error" });
        });
};

export const seasonDetail = (req, res) => {
    const { tvShow, season } = req.params;
    fetch(`${mainUri}/tv/${tvShow}?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            const parsedTvShow = data;
            if (parsedTvShow.success === false) {
                return res.status(500).render("error", { pageTitle: "500 Error" });
            } else {
                fetch(`${mainUri}/tv/${tvShow}/season/${season}?api_key=${API_KEY}`)
                    .then((res) => res.json())
                    .then((data) => {
                        const parsedSeason = data;
                        if (parsedSeason.success === false) {
                            return res.status(500).render("error", { pageTitle: "500 Error" });
                        } else {
                            return res.render("seasonsDetail", { pageTitle: `${parsedTvShow.name || parsedTvShows.title || '"Unknown"'} : Season ${season}`, season: parsedSeason, tvShowId: tvShow, tvShow: parsedTvShow });
                        };
                    }).catch((err) => {
                        return res.status(500).render("error", { pageTitle: "500 Error" });
                    });
            };
        }).catch((err) => {
            return res.status(500).render("error", { pageTitle: "500 Error" });
        });
};

export const episodeDetail = (req, res) => {
    const { tvShow, season, episode } = req.params;
    fetch(`${mainUri}/tv/${tvShow}/season/${season}/episode/${episode}?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            const parsedEpisode = data;
            if (parsedEpisode.success === false) {
                return res.status(500).render("error", { pageTitle: "500 Error" });
            } else {
                return res.render("episodeDetail", { pageTitle: `Season ${season} Episode ${episode}`, episode: parsedEpisode });
            };
        }).catch((err) => {
            return res.status(500).render("error", { pageTitle: "500 Error" });
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
                    return res.status(500).render("error", { pageTitle: "500 Error" });
                } else {
                    fetch(`${mainUri}/search/tv?api_key=${API_KEY}&query=${keyword}&page=1`)
                        .then((res) => res.json())
                        .then((data) => {
                            let tvShows = data.results;
                            if (data.success === false) {
                                return res.status(500).render("error", { pageTitle: "500 Error" });
                            } else {
                                fetch(`${mainUri}/search/movie?api_key=${API_KEY}&query=${keyword}&page=2`)
                                    .then((res) => res.json())
                                    .then((data) => {
                                        movies = movies.concat(data.results);
                                        if (data.success === false) {
                                            return res.status(500).render("error", { pageTitle: "500 Error" });
                                        } else {
                                            fetch(`${mainUri}/search/tv?api_key=${API_KEY}&query=${keyword}&page=2`)
                                                .then((res) => res.json())
                                                .then((data) => {
                                                    tvShows = tvShows.concat(data.results);
                                                    if (data.success === false) {
                                                        return res.status(500).render("error", { pageTitle: "500 Error" });
                                                    } else {
                                                        return res.render("search", {
                                                            pageTitle: "Search", 
                                                            movies, 
                                                            tvs: tvShows
                                                        });
                                                    };
                                                }).catch((err) => {
                                                    return res.status(500).render("error", { pageTitle: "500 Error" });
                                                });
                                        };
                                    }).catch((err) => {
                                        return res.status(500).render("error", { pageTitle: "500 Error" });
                                    });
                            };
                        }).catch((err) => {
                            return res.status(500).render("error", { pageTitle: "500 Error" });
                        });
                };
            }).catch((err) => {
                return res.status(500).render("error", { pageTitle: "500 Error" });
            });
    } else {
        return res.redirect(routes.home);
    }
};

export const library = (req, res) => {
    return res.send("LIBRARY FOR LOGIN!!!!!! bongsnh.... smash!!!!");
};

export const getLogin = (req, res) => {
    return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    const exists = await User.exists({ email });

    if (!exists) {
        return res.status(400).render("login", { 
            pageTitle: "Login", 
            errorMsg: `${email} could not be found for users with email`
        });
    } else {
        const user = await User.findOne({ email });
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).render("login", { 
                pageTitle: "Login", 
                errorMsg: "Password doesn't match" 
            });
        } else {
            req.session.user = user;
            return res.redirect(routes.home);
        };
    };
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect(routes.home);
};

export const getSignup = (req, res) => {
    return res.render("signup", { pageTitle: "Sign Up" });
};

export const postSignup = async (req, res) => {
    const { name, username, email, password, confrimPassword } = req.body;
    
    if (password !== confrimPassword) {
        return res.status(400).render("signup", { 
            pageTitle: "Sign Up", 
            errorMsg: "Password confrimation doesn't match" 
        });
    } else {
        const exists = await User.exists({ email });
        if (exists) {
            return res.status(400).render("signup", {
                pageTitle: "Sign Up", 
                errorMsg: "This email is already taken"
            });
        } else {
            await User.create({
                name, 
                username, 
                email, 
                password
            });
            return res.redirect(routes.login);
        };
    };
};