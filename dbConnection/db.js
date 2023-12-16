const mongoose=require('mongoose')
require('dotenv').config()
const db_url = process.env.DB_URL;
// console.log(db_url)

const db_connection = () => {
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
	mongoose.connect(db_url, connectionParams).then(()=>{
		console.log("Connected to database successfully");
	})
		
	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}

};

module.exports=db_connection;