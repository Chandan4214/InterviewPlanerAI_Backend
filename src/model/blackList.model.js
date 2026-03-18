const mongoose=require('mongoose');

const blackListSchema= new mongoose.Schema({
    token:{
      type:String,
      required:[true,'Token is required']
    }

},{
    timestamps:true
})

const tokenBlackListModel=mongoose.model("TokenBlackList",blackListSchema);

module.exports=tokenBlackListModel;