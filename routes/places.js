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
router.post("/", isLoggedIn, (req,res)=>{
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

	Place.create(newPlace)
	.then((place)=>{ res.redirect(`/places/${place._id}`) })
	.catch((err)=>{ res.send(err) })
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
router.put("/:id", checkPlaceOwner, (req, res) => {
	const updatedInfo = {
		imagen: req.body.imagen,
		lugar: req.body.lugar,
		descripcion: req.body.descripcion,
		typeOfPlace: req.body.typeOfPlace
	};
	
	Place.findByIdAndUpdate(req.params.id, updatedInfo, {new: true})
	.exec()
	.then((updatedPlace) => {
		res.redirect(`/places/${req.params.id}`)
	})
	.catch((err) => res.send(err))
})

// DELETE
router.delete("/:id", checkPlaceOwner, (req,res)=>{
	Place.findByIdAndDelete(req.params.id)
	.exec()
	.then((deletedPlace)=>{
		// console.log(deletedPlace);
		res.redirect("/places");
	})
	.catch((err)=>res.sen(err))
})


module.exports = router;