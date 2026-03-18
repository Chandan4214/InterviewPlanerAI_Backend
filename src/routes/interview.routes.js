const express=require('express');
const authMiddleware=require('../middlewares/auth.middleware')
const interviewRouter=express.Router();
const interviewController=require('../controllers/interview.controller');
const upload=require('../middlewares/file.middleware');
/*
@route POST /api/interview/generateReport
@description Generate interview preparation report based on candidate profile and job description user self description.
@acess private 
*/

interviewRouter.post('/generateReport',authMiddleware.authUser, upload.single('resume'), interviewController.generateReport)


/*
@route GET /api/interview/getReport/:id
@description Get the report of the user
@acess private 
*/
interviewRouter.get('/getReport/:id',authMiddleware.authUser, interviewController.getReportById)



/*
@route GET /api/interview/getALLReport
@description Get all report of the logged in user
@acess private 
*/
interviewRouter.get('/getReport',authMiddleware.authUser, interviewController.getAllReports)




module.exports=interviewRouter;