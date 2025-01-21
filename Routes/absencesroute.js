 const express = require('express');
const router = express.Router();
const absencesController=require('../Controllers/absencesController')
 
router.post('/addabsencesbyid/:id',absencesController.addabsencesbyid);  
router.get('/getallabsences', absencesController.getallabsences);
router.get('/getallabsencesforoneworker/:id',absencesController.getallabsencesforoneworker);
 
module.exports = router;