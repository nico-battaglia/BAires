const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// SIGN UP - Show form
router.get("/signup", (req, res)=>{
	res.render("signup");
})

// SIGN UP - Create user. '.register' is a Passport func => User.register(new User({}), password)
router.post("/signup", async (req, res)=>{
	try{
		const newUser = await User.register(
			new User( {username: req.body.username, email: req.body.email} ), 
				req.body.password);
				req.flash("success", `Welcome! Signed you up as ${newUser.username}`);
		
		passport.authenticate("local")(req, res, ()=>{
			res.redirect("/places");
		})
	}
	catch(err){
		console.log(err);
		req.flash("error", (err.name === 'MongoError' && err.code === 11000) ? 'Email already exists!': err.message);
		res.redirect("back");
	}
})

// LOGIN - Show Form
router.get("/login", (req, res)=>{
	res.render("login");
});

// LOGIN - Auth
router.post("/login", passport.authenticate("local", {
	successRedirect: "/places",
	failureRedirect: "/login",
	failureFlash: true,
	successFlash: "Welcome!"
}));

// LOGOUT
router.get("/logout", (req, res)=>{
	req.logout();
	req.flash("success", `Logged you out`);
	res.redirect("/places");
})


module.exports = router;