const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
	imagen: String,
	lugar: String,
	descripcion: String,
	typeOfPlace: [String],
	owner: {
		id: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
		username: String
	}
});

// Indexing all text fields for search bar
placeSchema.index({
	"$**": "text"
})

module.exports = mongoose.model('place', placeSchema);