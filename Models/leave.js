const mongoose=require('mongoose')
const Leaveschema=new mongoose.Schema({
     workerId: {
            type: mongoose.Schema.Types.ObjectId,  
            ref: 'Workers', 
       
        },
        leavedate:{
         type:String    
        },
        duration:{
            type:Number
        },
        status: {
            type: String,
            enum: ['accepted', 'rejected','Pending'], // Valeurs possibles
            default: 'Pending',           // Valeur par défaut
        }
})
const Leave = mongoose.model('Leave', Leaveschema);
module.exports = Leave;
