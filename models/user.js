let mongoose = require("mongoose")

let userSchema = new mongoose.Schema({
    name: String,
    rollno: String
});

module.exports = mongoose.model("User", userSchema);