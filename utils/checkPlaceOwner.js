const Place = require("../models/place");

const checkPlaceOwner = async (req, res, next)=>{
	if(req.isAuthenticated()){ //check if user is logged in
		const place = await Place.findById(req.params.id).exec();
		
		// Check if the user was the creator of the item (aka owner)
		if(place.owner.id.equals(req.user._id)){ //place.owner.id === req.user._id doesnt work. Dif obj types
			next();
		} else {
			req.flash("error", "You are not the creator of the place to edit it");
			res.redirect("/places/"+place._id);
		}
	}else{
		req.flash("error", "You have to log in first");
		res.redirect("/login");
	}
}
module.exports = checkPlaceOwner;