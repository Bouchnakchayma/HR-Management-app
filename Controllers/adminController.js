const mongoose = require('mongoose');
const admin =require('../Models/admin')
const Workers=require('../Models/Workers')
const leave=require('../Models/leave')
const Absence=require('../Models/Absences')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
require('dotenv').config({ path: './config.env' });
const upload = require("../middleware/multerConfig");
 
exports.addWorker = async (req, res) => {
    const { name, position, Joining_date, email, phone, salary } = req.body;

    // Vérification des champs requis
    if (!name || !position || !Joining_date || !email || !phone || !salary) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // Vérification de l'image après la vérification des autres champs
    const workerImage = req.file ? req.file.path : null;

    try {
        // Créer un nouvel objet Worker
        const newWorker = new Workers({
            name,
            position,
            Joining_date,
            email,
            phone,
            salary,
            workerImage, // Ajoutez le chemin de l'image ici
        });

        // Sauvegarder dans la base de données
        await newWorker.save();

        res.status(201).json({ message: "Worker added successfully!", worker: newWorker });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while saving the worker." });
    }
};

exports.getallworkers = async (req, res) => {
    try {
        const workers = await Workers.find();
        console.log(workers)
        res.status(200).send(workers)
    } catch (error) {
        res.status(404).send(error)
    }

};
exports.getWorkerbyid = async (req, res) => {
    try {
        const idworker = req.params.id;
        console.log('Worker ID:', idworker);  // Vérifier si l'ID est bien passé dans l'URL

        const Worker = await Workers.findById(idworker);
        console.log('Worker:', Worker);  // Vérifier la donnée récupérée

        if (!Worker) {
            return res.status(404).send({ message: 'Worker not found' });
        }

        res.status(200).send(Worker);
    } catch (error) {
        console.error('Error:', error);  // Afficher l'erreur si la requête échoue
        res.status(500).send({ message: 'Server error', error: error.message });
    }
};
exports.updateWorker = async (req, res) => {
    const idworker = req.params.id;
    const { name, position, Joining_date, email, phone, salary } = req.body;
    let workerImage = req.file ? req.file.path : null;  // Utilisez `let` pour pouvoir modifier la valeur

    // Si un fichier a été téléchargé, mettre à jour le chemin de l'image
    if (req.file) {
        workerImage = req.file.path;  // Enregistrer le chemin du fichier photo
    }

    try {
        // Recherche et mise à jour du worker dans la base de données
        const updatedWorker = await Workers.findByIdAndUpdate(
            idworker,
            { 
                name, 
                position, 
                Joining_date, 
                email, 
                phone, 
                salary, 
                workerImage: workerImage 
            },
            { new: true } 
        );

        if (!updatedWorker) {
            return res.status(404).json({ error: "Worker not found" });
        }

        res.status(200).json(updatedWorker);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du worker:", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du worker" });
    }
};
exports.deleteWorker=async (req,res)=>{
    try {
          const id = req.params.id;
    const Worker = await Workers.findByIdAndDelete(id)
    res.status(200).send({message:'deleted !'})
}
     catch (error) {
        res.status(404).send(error);
    }
  
};
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

  exports.Register = async (req, res) => {
    try {
        const data = req.body;
        const usr = new admin(data);

        // Génération et hachage du mot de passe
        const salt = bcrypt.genSaltSync(10);
        const cryptedPass = bcrypt.hashSync(data.password, salt);
        usr.password = cryptedPass;

        const savedUser = await usr.save();
        console.log(savedUser);
        res.status(200).send(savedUser);
        console.log("User successfully added");
    } catch (err) {
        console.error('Error during registration:', err.message, err.errors);
        res.status(400).send({ error: err.message, details: err.errors });
    }
};
exports.Login = async (req, res) => {
    const data = req.body;
    try {
        // Recherche de l'utilisateur dans la base de données
        const user = await admin.findOne({ email: data.email });
        if (!user) {
            return res.status(404).send('Email or password invalid!');
        }

        // Vérification du mot de passe
        const validPassword = await bcrypt.compare(data.password, user.password);
        if (!validPassword) {
            return res.status(401).send('Email or password invalid!');
        }

        // Création du payload pour le token
        const payload = {
            _id: user._id,
            email: user.email,
            name: user.name,
            role:user.Role
        };

        // Création du token avec une expiration d'une heure
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Envoi du token dans la réponse
        res.status(200).send({ mytoken: token });
    } catch (error) {
        // Gestion des erreurs en cas de problème avec le serveur
        res.status(500).send(error);
    }
};
 
exports.getAllWorkerssalaryDetails = async (req, res) => {
    try {
        const workers = await Workers.find();
        const workersDetails = [];
        for (const worker of workers) {
            const workerId = worker._id;
            const absences = await Absence.find({ workerId });
            const totalAbsenceDuration = absences.reduce((total, absence) => total + absence.duration, 0);
            const dailyWage = worker.salary / 30;
            const deductions = dailyWage * totalAbsenceDuration;
            const totalSalary = worker.salary - deductions;
            workersDetails.push({
                workerName: worker.name,
                salary: worker.salary,
                dailyWage,
                totalAbsenceDuration,
                deductions,
                totalSalary,
            });
        }
        res.json(workersDetails);
    } catch (error) {
        console.error('Error fetching workers details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getworkerdetails = async (req, res) => {
    try {
        const workerId = req.params.id;  
        const workers = await Workers.findById(workerId);
        const absences = await Absence.find({ workerId });
        console.log('Absences:', absences);

        
        const totalAbsenceDuration = absences.reduce((total, absence) => total + absence.duration, 0);
        console.log('Total Absence Duration:', totalAbsenceDuration);
        const dailyWage = workers.salary / 30; 
        const deductions = dailyWage * totalAbsenceDuration;
        const totalSalary = workers.salary - deductions;
        res.json({
            workerName: workers.name,
            salary: workers.salary,
            dailyWage,
            totalAbsenceDuration,
            deductions,
            totalSalary,
        });
    } catch (error) {
        console.error('Error fetching worker details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllLeavesWithWorkers = async (req, res) => {
    try {
    
        const leaves = await leave.find({ status: 'Pending' }).populate('workerId', 'name'); // Sélectionner uniquement certains champs de Workers

        res.json({
            success: true,
            data: leaves
        });
    } catch (error) {
        console.error('Error fetching leaves with workers:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to fetch data.'
        });
    }
};
exports.restrictTo = (...Role) => {
    return (req, res, next) => {
        // Vérifier si req.user existe et contient un rôle
        if (!req.user || !req.user.Role || !Role.includes(req.user.Role)) {
            return res.status(401).json({
                status: "echec",
                message: "You don't have the permission to do this action !!",
            });
        }
        next();
    };
};

