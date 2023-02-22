require("dotenv").config();
const mongoose = require("mongoose")

const dataBase = process.env.MONGODB_ATLAST;

const connect = () => {
    return mongoose.connect("mongodb+srv://ashokzarmariya:pranjal5290@cluster0.akgwvrs.mongodb.net/?retryWrites=true&w=majority");
}

module.exports = connect; 

//mongodb://127.0.0.1:27017/social_media
//hello this is my first app

//mongodb+srv://ashokzarmariya:pranjal5290@cluster0.akgwvrs.mongodb.net/?retryWrites=true&w=majority
  