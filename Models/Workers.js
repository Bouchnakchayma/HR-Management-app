const mongoose = require("mongoose");
const WorkersSchema = new mongoose.Schema({
    name: {
        type: String
    },
    position: {
        type: String
    },
   Joining_date: {
        type: String
    },
    email:{
        type:String
    },
    phone:{
type:String
    },
    salary:{
        type:Number
    },
    workerImage: {
        type: String, // Le chemin vers l'image stockée
        required: false
    }
})
const Workers = mongoose.model('Workers', WorkersSchema);
module.exports = Workers;