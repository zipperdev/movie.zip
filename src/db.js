import mongoose from "mongoose";

mongoose.connect("mongodb+srv://zippperdev:!ksh20101119@users.nugrp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false, 
    useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", (error) => console.log("⛔ DB Error : Cannot Connected to MongoDB", error));
db.once("open", () => console.log("🚀 DB Connected : Connected to MongoDB"));