const express=require("express");
const router = express.Router();
const isLoggedIn = require("../utils/isLoggedIn");
const checkPlaceOwner = require("../utils/checkPlaceOwner");

// Models
const Place = require("../models/place");
const Comment = require("../models/comment");

// All routes have as base: "/places"
// -----------------------------------------------

// SHOW all Places
router.get("/", (req,res)=>{
	Place.find()
	.exec()
	.then((places)=>{ res.render("places", {places}) })
	.catch((err)=>{ res.send(err) })
});

// ADD NEW Place - Show form to add new Place
router.get("/new", isLoggedIn, (req,res)=>{
	res.render("places_new");
})

// ADD NEW Place - Update DB
router.post("/", isLoggedIn, async (req,res)=>{
	const typeOfPlace = (req.body.typeOfPlace==null)? ["Other"] : req.body.typeOfPlace;
	const newPlace = {
		imagen: req.body.imagen,
		lugar: req.body.lugar,
		descripcion: req.body.descripcion,
		typeOfPlace: typeOfPlace,
		address: req.body.address,
		owner:{
			id: req.user._id,
			username: req.user.username
		},
		upvotes: [req.user.username],
		downvotes: []
	};
	try {
		const place = await Place.create(newPlace);
		res.redirect(`/places/${place._id}`);
	} catch(err){
		req.flash("error","Something went wrong accesing the database. Could not create the place. Please try again");
		console.log(err);
		res.redirect("/places");
	}
});

// SEARCH (this route before "/:id" or not going to work. Will treat the search like an id)
router.get("/search", async (req, res)=>{
	try{
		const places = await Place.find({
			$text:{ 
				$search: req.query.term 
			}
		});
		res.render("places",{places});
	}
	catch(err){
		res.send(err);
	}
})

// Show Places by Type of Place
router.get("/typeOfPlace/:type", async (req, res)=>{
	const validTypes=["Culture-Architecture", "Walk-friendly", "Food-Cafe", "Church", "Park", "Shopping", "Other"];
	if(validTypes.includes(req.params.type)){
		const places = await Place.find({typeOfPlace: req.params.type}).exec();
		res.render("places", {places, filter: req.params.type});
	} else {
		req.flash("error", "Wrong type of place");
		res.redirect("back");
	}
	})

// VOTE for place
router.post("/vote", isLoggedIn, async (req, res)=>{
	const place = await Place.findById(req.body.placeId);
	
	const alreadyUpvoted = place.upvotes.indexOf(req.user.username); // -1 if not found
	const alreadyDownvoted = place.downvotes.indexOf(req.user.username); // -1 if not found
	
	let response = {};
	
	// Voting Logic
	//not voted
	if (alreadyUpvoted===-1 && alreadyDownvoted===-1){
		
		if (req.body.voteType === "up") {
			place.upvotes.push(req.user.username);
			place.save();
			response = {message: "Upvoted!", code: "upvoted"};
			
		} else if (req.body.voteType === "down") {
			place.downvotes.push(req.user.username);
			place.save();
			response = {message: "Downvoted!", code: "downvoted"};
			
		} else {
			response = {message: "Error", code: "err"};
		}
	//Already upvoted	
	} else if (alreadyUpvoted>=0) { 
		
		if (req.body.voteType === "up") {
			place.upvotes.splice(alreadyUpvoted, 1);
			place.save();
			response = {message: "Upvote removed", code: "unvoted"};
			
		} else if (req.body.voteType === "down") {
			place.upvotes.splice(alreadyUpvoted, 1);
			place.downvotes.push(req.user.username);
			place.save();
			response = {message: "Change to downvote", code: "downvoted"};
		}
	//Already downvoted
	} else if (alreadyDownvoted>=0) { 
		
		if (req.body.voteType === "up") {
			place.downvotes.splice(alreadyDownvoted, 1);
			place.upvotes.push(req.user.username);
			place.save();
			response = {message: "Changed to upvote", code: "upvoted"};
			
		} else if (req.body.voteType === "down") {
			place.downvotes.splice(alreadyUpvoted, 1);
			place.save();
			response = {message: "Downvote removed", code: "unvoted"};
		}
	}
	
	response.score = place.upvotes.length - place.downvotes.length
	res.json(response); //Sending json to update "score" in frontend via place_show(.js & .ejs)
})

// Redirecting to Login if try voting without Login (href in + or - buttons without Login in places/:id)
router.get("/vote", (req, res)=>{
	req.flash("error", "You have to log in first");
	res. redirect("/login");
})

// Show Individual Place
router.get("/:id", async (req,res)=>{
	try{
		let place = await Place.findById(req.params.id).exec();
		let comments = await Comment.find({placeId: req.params.id});
		res.render("places_show", {place, comments})	
	}
	catch(err){
		res.send(err);
	}
})

// EDIT - Show form to Edit Place for Update
router.get("/:id/edit", checkPlaceOwner, async (req, res) =>{
	place = await Place.findById(req.params.id).exec();
	res.render("places_edit", {place})
});
	
// EDIT - Update Place Info
router.put("/:id", checkPlaceOwner, async (req, res) => {
	const typeOfPlace = (req.body.typeOfPlace==null)? ["Other"] : req.body.typeOfPlace;
	const updatedInfo = {
		imagen: req.body.imagen,
		lugar: req.body.lugar,
		descripcion: req.body.descripcion,
		typeOfPlace: typeOfPlace
	};
	try {
		const updatedPlace = await Place.findByIdAndUpdate(req.params.id, updatedInfo, {new: true}).exec();
		req.flash("success", "Place updated");
		res.redirect(`/places/${req.params.id}`);
	}catch(err){
		req.flash("error", "Something went wrong accesing the database. Could not create the place. Please try again");
		console.log(err);
		res.redirect("places");
	}
});

// DELETE
router.delete("/:id", checkPlaceOwner, async (req,res)=>{
	try{
		await Place.findByIdAndDelete(req.params.id).exec();
		req.flash("success", "Place deleted");
		res.redirect("/places");
	}catch(err){
		console.log(err);
		req.flash("error", "Something went wrong accesing the database. Could not delete the place. Please try again");
		res.redirect("back");
	}
})


module.exports = router;

