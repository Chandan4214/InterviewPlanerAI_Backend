
// const { GoogleGenAI } = require('@google/genai');
// const {z} = require('zod');
// const {zodToJsonSchema}= require('zod-to-json-schema');
// // The client gets the API key from the environment variable `GEMINI_API_KEY`.
// const ai = new GoogleGenAI({
//   apiKey: process.env.GOOGLE_GENAI_API_KEY,
// });

// // async function invokeAi() {
// //   const response = await ai.models.generateContent({
// //     model: "gemini-2.5-flash",
// //     contents: "Explain what is interview",
// //   });
// //   console.log(response.text);
// // }

// const interviewReportSchema = z.object({
//   matchScore: z.number().describe("The match score between 0-100 based on the similarity between the candidate and the job description"),

//   technicalQuestions: z.array(z.object({
//     question: z.string().describe("The technical question that can be asked during the interview"),
//     intension: z.string().describe("The intention of interviewer behind asking this question"),
//     answer: z.string().describe("How to answer this question ,what points to be covered in answer,what is approach to answer this question")
//   })).describe("Technical questions that can be asked during the interviewalong with their intention"),

//   behavioralQuestions: z.array(z.object({
//     question: z.string().describe("The behavioral question that can be asked during the interview"),
//     intension: z.string().describe("The intention of interviewer behind asking this question"),
//     answer: z.string().describe("How to answer this question ,what points to be covered in answer,what is approach to answer this question")
//   })).describe("Behavioral questions that can be asked during the interviewalong with their intention"),

//   skillGaps: z.array(z.object({
//     skill: z.string().describe("The skill that needs to be improved"),
//     severity: z.enum(["low", "medium", "high"]).default("low").describe("The severity of the skill gap")
//   })).describe("List of skills gaps in the candidate's profile along with their severity"),

//   preprationPlan: z.array(z.object({
//     day: z.number().describe("The day number in the preparation plan"),
//     focus: z.string().describe("The focus area for that day in the preparation plan"),
//     tasks: z.array(z.string()).describe("The tasks to be completed on that day in the preparation plan")
//   })).describe("A day wise preparation plan for the candidate to prepare for the interview")


// });



// async function generateInterviewReport({resume,selfdescription, jobDescription}){
// const prompt = `
// You are an expert technical interviewer.

// Analyze the candidate profile and generate a complete interview preparation report.

// IMPORTANT:
// - You MUST return all fields defined in the JSON schema.
// - The match score should be a number between 0-100 indicating how well the candidate matches the job description.
// - Generate at least 5 technical questions with intension and an answer.
// - Generate at least 5 behavioral questions with intensions and an answer.
// - Identify skill gaps.
// - Generate a 7 day preparation plan.

// Candidate Resume:
// ${resume}

// Candidate Self Description:
// ${selfdescription}

// Job Description:
// ${jobDescription}
// `;
//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: prompt,
//     config:{
//       responseMimeType:"application/json",
//       responseSchema: zodToJsonSchema(interviewReportSchema)

//     }

    
//   })

//   const result=JSON.parse(response.text)
//   console.log(result);
//   return result;
// }

// module.exports= generateInterviewReport;












const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function generateInterviewReport({ resume, selfdescription, jobDescription }) {

  const prompt = `
You are an expert technical interviewer.

Analyze the candidate resume, self description, and job description.

Return ONLY valid JSON.

Schema:
{
  "matchScore": number,
  "technicalQuestions":[
    {
      "question": string,
      "intension": string,
      "answer": string
    }
  ],
  "behavioralQuestions":[
    {
      "question": string,
      "intension": string,
      "answer": string
    }
  ],
  "skillGaps":[
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan":[
    {
      "day": number,
      "focus": string,
      "tasks": [string]
    }
  ],
  tittle:string
}

Rules:
- Give 5 technical questions
- Give 3 behavioral questions
- Give 3 skill gaps
- Create a 7 day preparation plan
- matchScore must be between 0-100
- Return ONLY JSON

Resume:
${resume}

Self Description:
${selfdescription}

Job Description:
${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let text = response.text;

  try {

    // Remove markdown code blocks if present
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Ensure JSON starts from {
    if (!text.startsWith("{")) {
      text = text.substring(text.indexOf("{"));
    }

    const json = JSON.parse(text);
    return json;

  } catch (err) {

    console.log("AI JSON PARSE ERROR:", text);

    // Safe fallback structure
    return {
      matchScore: 0,
      technicalQuestions: [],
      behavioralQuestions: [],
      skillGaps: [],
      preparationPlan: []
    };
  }
}

module.exports = generateInterviewReport;