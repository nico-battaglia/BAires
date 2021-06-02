const Comment = require("../models/comment");

const checkCommentOwner = async (req, res, next)=>{
	if(req.isAuthenticated()){ //check if user is logged in
		const comment = await Comment.findById(req.params.commentId).exec();
		
		// Check if the user was the creator comment
		if(comment.user.id.equals(req.user._id)){ 
			next();
		} else {
			res.redirect("back");
		}
	}else{
		res.redirect("/login");
	}
}
module.exports = checkCommentOwner;