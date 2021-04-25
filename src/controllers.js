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

export const getMovieDetail = async (req, res) => {
    const { id } = req.params;
    fetch(`${mainUri}/movie/${id}?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then(async (data) => {
            const movie = data;
            if (movie.success === false) {
                return res.status(500).render("error", { pageTitle: "500 Error" });
            } else {
                if (req.session.user) {
                    const user = await User.findOne({email: req.session.user.email});
                    return res.render("videoDetail", { pageTitle: `${movie.title || movie.name}`, video: movie, user });
                } else {
                    return res.render("videoDetail", { pageTitle: `${movie.title || movie.name}`, video: movie, user: undefined });
                };
            };
        }).catch((err) => {
            return res.status(500).render("error", { pageTitle: "500 Error" });
        });
};

export const postMovieDetail = async (req, res) => {
    const { id } = req.params;
    const { type } = req.body;
    const user = await User.findOne({email: req.session.user.email});
    fetch(`${mainUri}/movie/${id}?api_key=${API_KEY}`)
    .then((res) => res.json())
    .then(async (data) => {
            const movie = data;
            if (movie.success === false) {
                return res.status(500).render("error", { pageTitle: "500 Error" });
            } else {
                const includeMovies = user.includeMovies;
                if (type === "save") {
                    if (!includeMovies.includes(movie.id)) {
                        await User.findOneAndUpdate({ email: user.email }, { $push: { includeMovies: movie.id, library: movie } });
                    };
                    return res.redirect(routes.home);
                } else if (type === "remove") {
                    if (includeMovies.includes(movie.id)) {
                        await User.findOneAndUpdate({ email: user.email }, { $pull: { includeMovies: movie.id, library: { id: movie.id } } });
                    };
                    return res.redirect(routes.home);
                };
            };
        }).catch((err) => {
            return res.status(500).render("error", { pageTitle: "500 Error" });
        });
};

export const getTvShowDetail = async (req, res) => {
    const { id } = req.params;
    fetch(`${mainUri}/tv/${id}?api_key=${API_KEY}`)
    .then((res) => res.json())
    .then(async (data) => {
            const tvShow = data;
            if (tvShow.success === false) {
                return res.status(500).render("error", { pageTitle: "500 Error" });
            } else {
                if (req.session.user) {
                    const user = await User.findOne({email: req.session.user.email});
                    return res.render("videoDetail", { pageTitle: `${tvShow.title || tvShow.name}`, video: tvShow, user });
                } else {
                    return res.render("videoDetail", { pageTitle: `${tvShow.title || tvShow.name}`, video: tvShow, user: undefined });
                };
            };
        }).catch((err) => {
            return res.status(500).render("error", { pageTitle: "500 Error" });
        });
};

export const postTvShowDetail = async (req, res) => {
    const { id } = req.params;
    const { type } = req.body;
    const user = await User.findOne({email: req.session.user.email});
    fetch(`${mainUri}/tv/${id}?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then(async (data) => {
            const tvShow = data;
            if (tvShow.success === false) {
                return res.status(500).render("error", { pageTitle: "500 Error" });
            } else {
                const includeTvShows = user.includeTvShows;
                if (type === "save") {
                    if (!includeTvShows.includes(tvShow.id)) {
                        await User.findOneAndUpdate({ email: user.email }, { $push: { includeTvShows: tvShow.id, library: tvShow } });
                    };
                    return res.redirect(routes.home);
                } else if (type === "remove") {
                    if (includeTvShows.includes(tvShow.id)) {
                        await User.findOneAndUpdate({ email: user.email }, { $pull: { includeTvShows: tvShow.id, library: { id: tvShow.id } } });
                    };
                    return res.redirect(routes.home);
                };
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
                            return res.render("seasonsDetail", { pageTitle: `${parsedTvShow.name || parsedTvShows.title || '"Unknown"'} Season ${season}`, season: parsedSeason, tvShowId: tvShow, tvShow: parsedTvShow });
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
    fetch(`${mainUri}/tv/${tvShow}?api_key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            const parsedTvShow = data;
            if (parsedTvShow.success === false) {
                return res.status(500).render("error", { pageTitle: "500 Error" });
            } else {
                fetch(`${mainUri}/tv/${tvShow}/season/${season}/episode/${episode}?api_key=${API_KEY}`)
                    .then((res) => res.json())
                    .then((data) => {
                        const parsedEpisode = data;
                        if (parsedEpisode.success === false) {
                            return res.status(500).render("error", { pageTitle: "500 Error" });
                        } else {
                            return res.render("episodeDetail", { pageTitle: ` ${parsedTvShow.title || parsedTvShow.name || '"Unknown"'} Season ${season} Episode ${episode}`, episode: parsedEpisode, tv: parsedTvShow });
                        };
                    }).catch((err) => {
                        return res.status(500).render("error", { pageTitle: "500 Error" });
                    });
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

export const me = async (req, res) => {
    const user = await User.findOne({email: req.session.user.email});
    return res.render("profile", { pageTitle: `${user.username}'s Library`, user });
};

export const getMeDelete = (req, res) => {
    return res.render("deleteProfile", { pageTitle: "Delete User" });
};

export const postMeDelete = async (req, res) => {
    const { password } = req.body;
    const user = await User.findOne({ email: req.session.user.email });
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(400).render("deleteProfile", { 
            pageTitle: "Delete User", 
            errorMsg: "Password doesn't match" 
        });
    } else {
        await User.findOneAndDelete({ email: req.session.user.email });
        return res.redirect(routes.logout);
    };
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
    
    if (!password.length >= 8) {
        return res.status(400).render("signup", { 
            pageTitle: "Sign Up", 
            errorMsg: "Password does not exceed 8 characters" 
        });
    } else {
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
    }
};