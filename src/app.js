import express from "express";
import session from "express-session";
import routes from "./routes";
import appRouter from "./routers";
import "./db";
import "./models/User";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT

app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.use(
    session({
        secret: process.env.COOKIE_SECRET, 
        resave: false, 
        saveUninitialized: false, 
        cookie: {
            maxAge: 1209600000
        }
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use("/contents", express.static(__dirname + "/contents"));
app.use((req, res, next) => {
    res.locals.routes = routes;
    res.locals.appName = "Movie.ZIP";
    res.locals.userLogin = !!req.session.user;
    res.locals.user = req.session.user;
    next();
});
app.use(appRouter);
app.use((req, res) => {
    res.status(404).render("404");
});

app.listen(PORT, () => console.log(`✅ Server : http://localhost:${PORT}`))