const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	email:{type: String, required: true, unique: true},
	username:{type: String, required: true, unique: true},
});

//Adds aditional functionality to the userSchema for using "local" strategy
userSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model("user", userSchema);