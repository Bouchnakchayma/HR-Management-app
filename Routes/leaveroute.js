const express = require('express');
const router = express.Router();
const leavecontroller =require('../Controllers/leaveController')

router.post('/addleaveRequest/:id',leavecontroller.addleaveRequest)

router.get('/getAllRequestsforoneworker/:id',leavecontroller.getAllRequestsforoneworker)
router.get('/getallrequest',leavecontroller.getallrequest)
router.patch('/updateLeaveStatus/:id',leavecontroller.updateLeaveStatus)
module.exports = router;