// ======================
// Select elements
// ======================
const upvoteBtn = document.getElementById("upvote_btn");
const downvoteBtn = document.getElementById("downvote_btn");
const score = document.getElementById("score");

// ======================
// Helper functions
// ======================
const sendVote = async (voteType)=> {
	// 	Build fetch options
	const options={
		method: "POST",
		headers: {'Content-Type': 'application/json'}	
	}
	
	if (voteType === "up"){
		options.body = JSON.stringify({
			voteType: "up",
			placeId
		});
	} else if(voteType === "down"){
		options.body = JSON.stringify({
			voteType: "down",
			placeId
		});
	} else {
		throw "voteType must be 'up' or 'down'"
	}
	
	// 	Send fetch request
	await fetch("/places/vote", options)
	.then(data => data.json())
	.then(res => {
		console.log(res);
		handleVote(res.score, res.code);
	})
	.catch(err => console.log(err))
}

const handleVote = (newScore, code) => {
// 	update Score
	score.innerText = newScore;
// 	Update button colors
	if (code === "upvoted") {
		downvoteBtn.classList.remove("btn-danger");
		upvoteBtn.classList.add("btn-success");
	} else if (code === "downvoted") {
		upvoteBtn.classList.remove("btn-success");
		downvoteBtn.classList.add("btn-danger");
	} else if (code === "unvoted") {
		upvoteBtn.classList.remove("btn-success");
		downvoteBtn.classList.remove("btn-danger");
		upvoteBtn.classList.add("btn-outline-success");
		downvoteBtn.classList.add("btn-outline-danger");
	}
}

// ======================
// Add event listeners
// ======================
upvoteBtn.addEventListener("click", async function(){
	sendVote("up");
});

downvoteBtn.addEventListener("click", async function(){
	sendVote("down");
});


