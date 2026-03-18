const mongoose=require('mongoose');




/**
 * job description:String
 * resume text:string
 * self description:String
 * 
 * MatchScore:number
 * 
 * techical questions :
 * [{
 *       question:"",
 *       intension:"",
 *       answer:""
 * }]
 * behavioral questions:
 *  [{
 *       question:"",
 *       intension:"",
 *       answer:""
 * }]
 * skills gaps:
 * [{   
 *     skill:"",
 *     severity:{
 *    type:String,
 *   enum:["low","medium","high"
 *    ]}
 * }]
   preparation plane:
   [{    
        day:Number,
        focus:string,
        tasks:[string]
   }]
 *  
 * 
 */
   const technicalQuestionSchema=new mongoose.Schema({
    question:{
        type:String,
        required:[true, "Question is required"]
    },
    intension:{
        type:String,
        required:[true, "Intension is required"]
    },
    answer:{
        type:String,
        required:[true, "Answer is required"]
    }
   },{
    _id:false
   })
   const behavioralQuestionSchema=new mongoose.Schema({
   question:{
        type:String,
        required:[true, "Question is required"]
    },
    intension:{
        type:String,
        required:[true, "Intension is required"]
    },
    answer:{
        type:String,
        required:[true, "Answer is required"]
    }
   },{
    _id:false
   })
  const skillGapSchema = new mongoose.Schema({
  skill:{
    type:String,
    required:[true,"Skill is required"]
  },
  severity:{
    type:String,
    enum:["low","medium","high"],
    default:"low"
  }
},{
  _id:false
})
   const preparationPlanSchema=new mongoose.Schema({
      day:{
        type:Number,
        required:[true, "Day is required"]
      },
      focus:{
        type:String,
        required:[true, "Focus is required"]
      },
      tasks:[{
        type:String,
        required:[true, "Task is required"]
      }]
   })

   const interviewReportSchema=new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true, "Job description is required"]
    },
    resume:{
        type:String,
      
    },
    selfDescription:{
        type:String,
    },
    matchScore:{
        type:Number,
        min:0,
        max:100
    },
    technicalQuestions:[technicalQuestionSchema],
    behavioralQuestions:[behavioralQuestionSchema],
    skillGaps:[skillGapSchema],

    preparationPlan:[preparationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        
    },
    tittle:{
        type:String,required:[true,"Tittle is required"]
    }
   },{
    timestamps:true
   })


   module.exports=mongoose.model("InterviewReport",interviewReportSchema)
   