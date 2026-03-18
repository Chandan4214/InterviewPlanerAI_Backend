
const jwt = require('jsonwebtoken');
const UserModel = require('../model/user.model');
const tokenBlackListModel = require("../model/blackList.model");

async function authUser(req, res, next) {

    console.log("Cookies:", req.cookies);

    const token = req.cookies.token;
    console.log("Token:", token);

    if (!token) {
        return res.status(401).json({ message: "Token not provided" });
    }


    try {
       const isBlacklisted = await tokenBlackListModel.findOne({ token });
       if (isBlacklisted){
        return res.status(401).json({ message: "Token is blacklisted" });
       }
       
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("Decoded JWT:", decoded);
  
        const user = await UserModel.findById(decoded._id);


        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;

        next();

    } catch (err) {
        console.log("JWT ERROR:", err);
        return res.status(401).json({ message: "Invalid token" });
    }
}



module.exports = { authUser };
