import mongoose from "mongoose";
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false, 
    useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", (error) => console.log("⛔ DB Error : Cannot Connected to MongoDB", error));
db.once("open", () => console.log("🚀 DB Connected : Connected to MongoDB"));