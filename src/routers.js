import express from "express";
import routes from "./routes";
import { home, getLogin, postLogin, logout, search, getSignup, postSignup, library, getMovieDetail, postMovieDetail, getTvShowDetail, postTvShowDetail, seasonDetail, episodeDetail } from "./controllers";

const appRouter = express.Router();

function forLoggedIn(req, res, next) {
    if (res.locals.userLogin) {
        next();
    } else {
        res.redirect(routes.home);
    }
};

function forLoggedOut(req, res, next) {
    if (!res.locals.userLogin) {
        next();
    } else {
        res.redirect(routes.home);
    }
};

appRouter.route(routes.home).get(home);
appRouter.route(routes.movieDetail()).get(getMovieDetail).post(postMovieDetail);
appRouter.route(routes.tvShowDetail()).get(getTvShowDetail).post(postTvShowDetail);
appRouter.route(routes.seasonDetail()).get(seasonDetail);
appRouter.route(routes.episodeDetail()).get(episodeDetail);
appRouter.route(routes.search).get(search);
appRouter.route(routes.library).get(forLoggedIn, library);
appRouter.route(routes.login).get(forLoggedOut, getLogin).post(forLoggedOut, postLogin);
appRouter.route(routes.logout).get(forLoggedIn, logout);
appRouter.route(routes.signup).get(forLoggedOut, getSignup).post(forLoggedOut, postSignup);

export default appRouter;