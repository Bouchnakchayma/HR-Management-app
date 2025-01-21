const mongoose = require("mongoose");
const AdminSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email:{
        type:String
    },
    lastname: {
        type: String
    },
    age: {
        type: Number
    },
     
    password: {
        type: String,
        minlength: 8
    },
    Role: {
      
            type: String,
            default: "HR",
            enum: ["admin", "HR"],
        
    },
})
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;