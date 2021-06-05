const express=require("express");
const router = express.Router();
const isLoggedIn = require("../utils/isLoggedIn");
const checkPlaceOwner = require("../utils/checkPlaceOwner");

// Models
const Place = require("../models/place");
const Comment = require("../models/comment");

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
	const newPlace = {
		imagen: req.body.imagen,
		lugar: req.body.lugar,
		descripcion: req.body.descripcion,
		typeOfPlace: req.body.typeOfPlace,
		owner:{
			id: req.user._id,
			username: req.user.username
		}
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
	const validTypes=["Culture-Architecture", "Walk-friendly", "Food-Cafe", "Church", "Park", "Shopping"];
	if(validTypes.includes(req.params.type)){
		const places = await Place.find({typeOfPlace: req.params.type}).exec();
		res.render("places", {places});
	} else {
		req.flash("error", "Wrong type of place");
		res.redirect("back");
	}
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
	const updatedInfo = {
		imagen: req.body.imagen,
		lugar: req.body.lugar,
		descripcion: req.body.descripcion,
		typeOfPlace: req.body.typeOfPlace
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