const express=require('express');
const router=express.Router();
const handleAllUsers=require('../controllers/user')

//post any data api
router.post('/PostUserData',handleAllUsers.authenticateToken,handleAllUsers.postData);
router.post('/PostUserTicket',handleAllUsers.authenticateToken,handleAllUsers.postTicket);
router.post('/postClinic',handleAllUsers.authenticateToken,handleAllUsers.postClinic);
router.post('/addTask',handleAllUsers.authenticateToken,handleAllUsers.addTask);

//get any data api
router.get('/GetUserData',handleAllUsers.authenticateToken,handleAllUsers.getData);
router.get('/GetCurrentUserData/:id',handleAllUsers.authenticateToken,handleAllUsers.getCurrentUserData);
router.get('/GetTicketData',handleAllUsers.authenticateToken,handleAllUsers.getTicketData);
router.get('/GetClinicData',handleAllUsers.authenticateToken,handleAllUsers.getClinicData);
router.get('/tasks/:taskId',handleAllUsers.authenticateToken,handleAllUsers.getTask);


//put any data api
router.put('/tasks/:taskId/complete',handleAllUsers.authenticateToken,handleAllUsers.completeTask);
router.put('/tasks/:taskId/pause',handleAllUsers.authenticateToken,handleAllUsers.pauseTask);
router.put('/tasks/:taskId/renew',handleAllUsers.authenticateToken,handleAllUsers.renewTask);
router.put('/tasks/:taskId/result',handleAllUsers.authenticateToken,handleAllUsers.addResultFromComment);
router.put('/tasks/:taskId/startTask',handleAllUsers.authenticateToken,handleAllUsers.startTask);
router.put('/tasks/:taskId/updateTask',handleAllUsers.authenticateToken,handleAllUsers.updateTask);


//login api
router.post('/userLogin',handleAllUsers.loginUser);
module.exports=router;