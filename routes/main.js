const express=require("express");
const router = express.Router();
const isLoggedIn = require("../utils/isLoggedIn");

router.get("/", (req,res)=>{
	res.render("index");
})

module.exports = router;
