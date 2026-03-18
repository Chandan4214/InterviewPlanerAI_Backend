const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../model/blackList.model");
/**
 * @name registerUserController
 * @description Controller to handle user registration
 *@access Public
 *
 **/

async function registerUserController(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Account already exists with this email" });
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({ username, email, password: hash });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    res.cookie("token", token);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Error registering user", err);
  }
}
async function LoginUserController(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try{
    const user= await userModel.findOne({email});
    if(!user){
      res.status(404).json({message:"User not found"});
    }
    const isMatch= await bcrypt.compare(password,user.password);
    if (!isMatch) {
      res.status(401).json({message:"Invalid credentials"});
    }
    else{
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });
      res.cookie("token", token);
      res.status(200).json({
        message: "User logged in successfully",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    }


  }
  catch(error){
    console.error("Error logging in user", error);
  }
}


async function logoutUserController(req,res){
  const token = req.cookies.token;
  try{
    if (token){
      await tokenBlackListModel.create({token});
    }
    res.clearCookie("token");
    res.status(200).json({message:"User logged out successfully"});

  }
  catch(error){
    console.error("Error logging out user", error);
  }
}


async function getMeController(req,res){
  try{
    const user= await userModel.findById(req.user._id).select("-password");
    console.log("User details fetched:", user);
    res.status(200).json({
      message:"User details fetched successfully",
      user:{
        id:user._id,
        username:user.username,
        email:user.email
      }
    }

    )

  }
  catch(error){
    console.error("Error fetching user details", error);
  }
}




module.exports = { registerUserController, LoginUserController,
  logoutUserController,getMeController
 };
