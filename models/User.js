const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const stockSchema = new Schema({
    stock: {
        type: String,
    },
})
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
        stocks: {
            type: Array
        },
        date: {
            type: Date,
            default: Date.now
        }
        
    },
    { strict: false }

);
module.exports = User = mongoose.model("users", UserSchema);