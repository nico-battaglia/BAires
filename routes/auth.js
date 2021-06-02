const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// SIGN UP - New
router.get("/signup", (req, res)=>{
	res.render("signup");
})

// SIGNU UP - Create. .register is a Passport func => User.register(new User({}), password)
router.post("/signup", async (req, res)=>{
	try{
		const newUser = await User.register(
			new User( {username: req.body.username, email: req.body.email} ), 
			req.body.password);
		
		passport.authenticate("local")(req, res, ()=>{
			res.redirect("/places");
		})
	}
	catch(err){
		res.send(err)
	}
})

// LOGIN - Show Form
router.get("/login", (req, res)=>{
	res.render("login");
});

// LOGIN - Auth
router.post("/login", passport.authenticate("local", {
	successRedirect: "/places",
	failureRedirect: "/login"
}));

// LOGOUT
router.get("/logout", (req, res)=>{
	req.logout();
	res.redirect("/places");
})


module.exports = router;