const mongoose = require("mongoose");
const absenceSchema = new mongoose.Schema({
    workerId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Worker', 
        required: true
    },
    AbsenceDate: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: true
    }
});
const Absences = mongoose.model('Absence', absenceSchema);
module.exports = Absences;
