import express from "express";
import routes from "./routes";
import appRouter from "./routers";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use("/contents", express.static(__dirname + "/contents"));
app.use((req, res, next) => {
    res.locals.routes = routes;
    res.locals.appName = "Movie.zip";
    next();
});
app.use(appRouter);

app.listen(PORT, () => console.log(`✅ Server : http://localhost:${PORT}`))