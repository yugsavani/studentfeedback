const jwt = require("jsonwebtoken");
const User= require("../../models/registers");

const auth = async(req,res,next)=>{
try {
    const token = req.cookies.jwt;
    const verifyUser= jwt.verify(token,process.env.SECRET_KEY);
    // console.log(verifyUser);

    const user= await User.findOne({_id:verifyUser._id})
    // console.log(user);
    next();

    req.token=token;
    req.user=user;

} catch (error) {
    res.status(400).send(error);
}

}

module.exports = auth;