const mongoose = require("mongoose");

const Absences = require('../Models/Absences')
const worker = require('../Models/Workers');
exports.addabsencesbyid = async (req, res) => {
    try {
        const workerId = req.params.id;
        const { AbsenceDate, duration, reason } = req.body;

        // Log des données reçues
        console.log('Data received:', req.body);

        if (!workerId  || !AbsenceDate || !duration || !reason) {
            return res.status(400).json({ message: 'All fields are required.', data: req.body });
        }

        const newAbsence = new Absences({
            workerId,
            AbsenceDate,
            duration,
            reason,
        });

        await newAbsence.save();
        return res.status(201).json({ message: 'Absence added successfully.', absence: newAbsence });
    } catch (error) {
        console.error('Error adding absence:', error);
        return res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

exports.getallabsences = async (req, res) => {
  try {
    console.log("Received request for all absences");
    const workers = await worker.find();
     console.log(workers);
    const workersWithAbsences = [];

    for (let worker of workers) {
      const absences = await Absences.find({ workerId: worker._id });
      workersWithAbsences.push({ worker, absences });
    }

    res.status(200).json(workersWithAbsences);
  } catch (error) {
    console.error("Error fetching absences:", error);
    res.status(404).send(error);
  }
};


exports.getallabsencesforoneworker=async (req,res)=>{
  try {

    const idworker =req.params.id;
    const absences = await Absences.find({ workerId: idworker });

    res.status(200).send(absences)

  } catch (error) {

    res.status(404).send(error)
    
  }
}
exports.protect = async (req, res, next) => {
  try {
      // Récupération du token dans l'en-tête Authorization
      let token = req.headers.authorization.split(" ")[1];
      if (!token) {
         
          return res.status(401).send({
              status: "echec", 
              message: "You are not connected! You need to be connected to access !!", // Message d'erreur
          });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Recherche de l'utilisateur correspondant au token décodé
      const currentUser = await admin.findById(decoded._id);
      if (!currentUser) {
          // Si l'utilisateur n'existe plus dans la base de données;
          return res.status(401).send({
              status: "echec", // Statut d'échec
              message: "User of this token no longer exists !!", // Message d'erreur
          });
      }
      req.user = currentUser; // Stockage des détails de l'utilisateur dans la requête
      next(); // Passage au middleware suivant ou au contrôleur
  } catch (err) {
      // Gestion des erreurs éventuelles (exemple : token invalide ou expiré)
      return res.status(401).send({
          status: "echec", // Statut d'échec
          message: "Invalid token or token expired !!", // Message d'erreur
      });
  }
};
exports.restrictTo = (...Role) => {
  return (req, res, next) => {
    if (!Role.includes(req.user.Role)) {
      
      return res.status(401).json({
        status: "echec",  
        message: "You don't have the permission to do this action !!",  
      });
    }
    next();
  };
};