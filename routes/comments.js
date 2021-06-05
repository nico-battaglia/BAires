const express=require("express");
const router = express.Router({mergeParams: true});
const isLoggedIn = require("../utils/isLoggedIn");
const checkCommentOwner = require("../utils/checkCommentOwner");

// Models
const Comment = require("../models/comment");

// New comment - Show Form
router.get("/new", isLoggedIn, (req,res)=>{
	res.render("comments_new", {placeId: req.params.id})
})

// New comment - Add comment to DB
router.post("/", isLoggedIn, async (req,res)=>{
	const newComment = {
		user: {id: req.user._id, 
			   username: req.user.username},
		text: req.body.text,
		placeId: req.params.id
	}
	try{
		await Comment.create(newComment);
		res.redirect(`/places/${req.params.id}`);
	}catch(err){
		console.log(err);
		req.flash("error", "Error while trying to create comment");
		res.redirect("")
	}
})

// Edit Comment - Render Form
router.get("/:commentId/edit", checkCommentOwner, async (req, res)=>{
	try{
		let comment = await Comment.findById(req.params.commentId)
		res.render("comments_edit", {placeId: req.params.id, comment})	
	}
	catch(err){
		res.send(err)
	}
})

// Edit Comment - Update in DB
router.put("/:commentId",  checkCommentOwner, async (req, res)=>{
	const updatedInfo = {
		text:req.body.text
		}
	try{
		let comment = await Comment.findByIdAndUpdate(req.params.commentId, updatedInfo, {new: true});
		res.redirect("/places/" + req.params.id);	
	}
	catch(err){
		req.flash("error", "Error while trying to edit comment");
		res.redirect("/places/" + req.params.id);
	}
})

// DELETE Comment
router.delete("/:commentId",  checkCommentOwner, async (req,res)=>{
	try{
		await Comment.findByIdAndDelete(req.params.commentId).exec();
		req.flash("success", "Comment deleted");
		res.redirect("/places/"+req.params.id);
	}
	catch(err){
		req.flash("error", "Error while trying to delete comment");
		res.redirect("/places/"+req.params.id);
	}
})


module.exports = router;