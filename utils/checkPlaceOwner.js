const Place = require("../models/place");

const checkPlaceOwner = async (req, res, next)=>{
	if(req.isAuthenticated()){ //check if user is logged in
		const place = await Place.findById(req.params.id).exec();
		
		// Check if the user was the creator of the item (aka owner)
		if(place.owner.id.equals(req.user._id)){ //place.owner.id === req.user._id doesnt work. Dif obj types
			next();
		} else {
			res.redirect("back");
		}
	}else{
		res.redirect("/login");
	}
}
module.exports = checkPlaceOwner;