import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        unique: true, 
        required: true
    }, 
    username: {
        type: String, 
        maxlength: 60, 
        required: true
    }, 
    name: {
        type: String, 
        maxlength: 60, 
        required: true
    }, 
    password: {
        type: String, 
        minlength: 8, 
        required: true
    }, 
    library: [
        {
            type: Object
        }
    ], 
    includeMovies: [
        {
            type: Number
        }
    ], 
    includeTvShows: [
        {
            type: Number
        }
    ]
});

userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema, "users");

export default User;