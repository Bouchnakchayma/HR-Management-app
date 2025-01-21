const mongoose=require("mongoose")

const leaves =require('../Models/leave')
 const Workers=require('../Models/Workers')

exports.addleaveRequest = async (req, res) => {
    try {
        const workerId = req.params.id;  
        const leaveData = req.body;  
        const workerExists = await Workers.findById(workerId);
        // Ajoutez l'ID du worker aux données du congé
        leaveData.workerId = workerId;
        const newLeave = new leaves(leaveData);
        await newLeave.save();
        // Réponse avec succès
        res.status(201).send({
            message: "Leave request added successfully",
            leave: newLeave,
        })
    } catch (error) {
        console.error("Error adding leave request:", error);
        res.status(500).send({ message: "Server error", error });
    }
};
exports.getAllRequestsforoneworker = async (req, res) => {
    try {
        const idworker = req.params.id;
        const allLeaves = await leaves.find({ workerId: idworker });
        res.status(200).send(allLeaves); // Sending the data back to the frontend
    } catch (error) {
        res.status(500).send({ error: 'Erreur lors de la récupération des demandes', details: error });
    }
};
exports.getallrequest = async (req, res) => {
    try {
        // Utilisation de populate pour inclure les détails du travailleur
        const leave = await leaves.find()
            .populate('workerId', 'name'); // Récupérer uniquement les champs nécessaires
        
        res.status(200).send(leave);  // Renvoyer les demandes de congé avec les informations du travailleur
    } catch (error) {
        console.error("Error fetching leave requests: ", error);  // Log pour débogage
        res.status(500).send({ message: "There was an error retrieving the leave requests." });
    }
};
const Leave = require('../Models/leave'); // Assurez-vous que le chemin est correct

exports.updateLeaveStatus = async (req, res) => {
    try {
        const leaveId = req.params.id; // ID du congé à mettre à jour
        const { status } = req.body; // Nouveau statut (accepted, rejected, etc.)

        // Validation du statut
        const validStatuses = ['accepted', 'rejected', 'Pending'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value. Valid values are: accepted, rejected, Pending.'
            });
        }

        // Mise à jour du statut
        const updatedLeave = await Leave.findByIdAndUpdate(
            leaveId,
            { status },
            { new: true } // Retourne le document mis à jour
        );

        if (!updatedLeave) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: `Leave status updated to ${status}.`,
            data: updatedLeave
        });
    } catch (error) {
        console.error('Error updating leave status:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the leave status.',
            error: error.message
        });
    }
};
