const place_seed = [
	{
		typeOfPlace: ["Culture/Arquitecture","Food/Cafe"],
		imagen: "https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2016/09/13073437/foro-economico-Centro-Cultural-Kirchner-CCK-frente-fachada-AE-1920-3.jpg",
		lugar: "Centro Cultural Kirchner",
		descripcion: "Centro Cultural, restaurante en último piso. Anteriormente era edificio del correo central"
	},
	{
		typeOfPlace: [],
		imagen: "https://viajes.nationalgeographic.com.es/medio/2017/10/30/avenida-9-de-julio-y-obelisco_ca2ddfb0.jpg",
		lugar: "Av. 9 de Julio",
		descripcion: "Avenida céntrica de Buenos Aires, conecta Norte y Sur"
	},
	{
		typeOfPlace: ["Park"],
		imagen: "https://vivilaciudad.com.ar/wp-content/uploads/2021/01/jardin-japones-1-copia-960x600.jpg",
		lugar: "Jardin Japones",
		descripcion: "Espacio verde con temática japonesa"
	},
	{
		typeOfPlace: ["Culture/Arquitecture"],
		imagen: "http://teatrocolon.org.ar/sites/default/files/styles/d8/public/2019-10/teatro-colon_exterior_001.jpg?itok=H4-VExa7",
		lugar: "Teatro Colon",
		descripcion: "Opera house.\r\nIt is considered one of the ten best opera houses in the world and is acoustically considered to be amongst the five best concert venues in the world.\r\n\r\nLorem Ipsum is simply dummy text of the printing and\r\n\r\n typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
	},
	{
		typeOfPlace: [],
		imagen: "https://www.revistaelabasto.com.ar/wp-content/uploads/2020/09/reserva-ecologica-1.jpg",
		lugar: "Reserva Ecologica",
		descripcion: "green place to walk and sun"
	},
	{
		typeOfPlace: ["Culture/Arquitecture","Park"],
		imagen: "https://i2.wp.com/cms.babbel.news/wp-content/uploads/2018/03/ArgentinianLanguages.png",
		lugar: "Congreso",
		descripcion: "Congreso de la Nación. Es la sede del poder legislativo, donde se juntan senadores y diputados a sesionar. Para mirar arquitectura. Hay una plaza en frente"
	},
	{
		typeOfPlace: ["Culture/Arquitecture","Food/Cafe","Shopping"],
		imagen: "https://blog.esplendorhoteles.com/wp-content/uploads/2016/05/fachada-galerias-pacifico.jpg",
		lugar: "Galerias Pacifico",
		descripcion: "Shopping mall + frescos en la cúpula"
	},
	{
		typeOfPlace: ["Walking Friendly","Food/Cafe"],
		imagen: "https://www.alternativaprop.com/blog/wp-content/uploads/2018/08/26860888698_101111c116_b.jpg",
		lugar: "Puerto Madero",
		descripcion: "Para caminar, tomar sol y comer algo. Restos y cafes sobre diques. Medio caro"
	},
	{
		typeOfPlace: ["Culture/Arquitecture"],
		imagen: "https://www.laguiadebuenosaires.com/wp-content/uploads/2020/11/palermo-malba.jpg",
		lugar: "MALBA",
		descripcion: "Museo Arte Contemporáneo"
	}
]
	
const Place = require("../models/place");
const Comment = require("../models/comment");

const DbSeed = async ()=>{
	await Place.deleteMany();
	console.log("Deleted Comics");
	
	await Comment.deleteMany();
	console.log("Deleted Comments");
	
	// Create new places in Db with a comment in each
	// for(const seed of place_seed){
	// 	let createdPlace = await Place.create(seed);	
	// 	await Comment.create({
	// 		user: "ScoobyDoo",
	// 		text: "Wonderfull place. And bla bla bla",
	// 		placeId: createdPlace._id
	// 	})
	// }
}


module.exports = DbSeed;
