const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema( {
        name: {
            type: String
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
        
    },
    { strict: false }

);
module.exports = User = mongoose.model("users", UserSchema);