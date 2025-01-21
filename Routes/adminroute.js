const adminController = require('../Controllers/adminController')
const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const upload = require("../middleware/multerConfig");
router.post('/Login', adminController.Login);
router.post('/addWorker', upload.single('workerImage'), adminController.addWorker);



router.get('/getallworkers', adminController.getallworkers);
router.get('/getWorkerbyid/:id', adminController.getWorkerbyid);
router.put('/updateWorker/:id', upload.single('photo'), adminController.updateWorker);
router.delete('/deleteWorker/:id', adminController.deleteWorker);
router.get('/getworkerdetails/:id', adminController.getworkerdetails)
router.post('/Register', adminController.Register)
router.get('/getAllLeavesWithWorkers', adminController.getAllLeavesWithWorkers)

router.get('/getAllWorkerssalaryDetails',adminController.getAllWorkerssalaryDetails)
// Exemple de route

module.exports = router;
 