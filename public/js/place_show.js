// ======================
// Select elements
// ======================
const upvoteBtn = document.getElementById("upvote_btn")
const downvoteBtn = document.getElementById("downvote_btn")

// ======================
// Helper functions
// ======================
const sendVote = async (voteType)=> {
	// 	Build fetch options
	const options={
		method: "POST",
		headers: {
      'Content-Type': 'application/json'
		}	
	}
	if (voteType === "up"){
		options.body = JSON.stringify({vote: "up"});
	} else if(voteType === "down"){
		options.body = JSON.stringify({vote: "down"});
	} else {
		throw "voteType must be 'up' or 'down'"
	}
	
	// 	Send fetch request
	await fetch("/places/vote", options)
	.then(data => data.json())
	.then(res => console.log(res))
	.catch(err => console.log(err))
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


