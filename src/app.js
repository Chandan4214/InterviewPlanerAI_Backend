const express=require('express');
const app=express();
const authRouter=require('./routes/routes');
const interviewRouter=require('./routes/interview.routes');
const cookieParser=require('cookie-parser');
const cors=require('cors');

app.use(cors({
  
  origin:"https://interview-planer-ai-frontend-8q9e.vercel.app",
  credentials:true
}
));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("✅ Server is up and running");
});
// using all the routes here
app.use('/api/auth',authRouter);
app.use('/api/interview',interviewRouter);

module.exports=app; 



