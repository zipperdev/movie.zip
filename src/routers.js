import express from "express";
import routes from "./routes";
import { home, login, logout, search, signup, movieDetail, tvShowDetail, seasonDetail, episodeDetail } from "./controllers";

const appRouter = express.Router();

appRouter.route(routes.home).get(home);
appRouter.route(routes.movieDetail()).get(movieDetail);
appRouter.route(routes.tvShowDetail()).get(tvShowDetail);
appRouter.route(routes.seasonDetail()).get(seasonDetail);
appRouter.route(routes.episodeDetail()).get(episodeDetail);
appRouter.route(routes.search).get(search);
appRouter.route(routes.login).get(login);
appRouter.route(routes.logout).get(logout);
appRouter.route(routes.signup).get(signup);

export default appRouter;