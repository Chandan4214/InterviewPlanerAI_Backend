const pdfParse=require("pdf-parse")
const generateInterviewReport=require('../services/ai.service');
const interviewReportModel=require("../model/interviewReport.model")

async function generateReport(req,res){
  const resumeFile=req.file;
  const resumeContent= await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText();

  const {selfDescription,jobDescription}=req.body

  const interViewReportByAi= await generateInterviewReport({
    resume:resumeContent.text,
    selfdescription:selfDescription,
    jobDescription
  })
  console.log("AI RESULT:", interViewReportByAi); 

  const interviewReport=await interviewReportModel.create({
    user:req.user.id,
    
    resume:resumeContent.text,
    selfDescription,
    jobDescription,
    matchScore:interViewReportByAi.matchScore,
    technicalQuestions: interViewReportByAi.technicalQuestions,
    behavioralQuestions: interViewReportByAi.behavioralQuestions,
    skillGaps:interViewReportByAi.skillGaps,
    preparationPlan:interViewReportByAi.preparationPlan,
    tittle:interViewReportByAi.tittle
  })
  res.status(201).json({
    message:"Interview report generated successfully",
    report:interviewReport
  })  

}

async function getReportById(req,res){
     const {interviewId}=req.params;

     const interviewReport=await interviewReportModel.findOne({
      id:interviewId,
      user:req.user.id
     })

     if (!interviewReport){
      return res.status(404).json({message:"Interview report not found"});
     }

     res.status(200).json({
      message:"Interview report fetched successfully",
      report:interviewReport
     })

}

/**  fetch all the interview reports from the user history */

async function getAllReports(req,res){
  const interviewReports=await interviewReportModel.find({
    user:req.user.id
  }).sort({createdAt:-1}).select("-resume -jobDescription -selfDescription -__V  -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan").limit(10);
    console.log(interviewReports);
  res.status(200).json({
    message:"Interview reports fetched successfully",
    reports:interviewReports
  })
  
}






module.exports={generateReport,getReportById,getAllReports}



