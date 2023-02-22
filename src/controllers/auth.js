require("dotenv").config();
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const newToken = (user) => {
    return jwt.sign({ user: user }, process.env.THE_SECERET_TOKEN);
}
 
///ok ok ok ok ok


const register = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email }).lean().exec();
        if (user)
            return res.status(400).send({ message: "email is alredy exist",isAuth:false });
        
        const isUsernameTeken = await User.findOne({ username: req.body.username }).lean().exec();
        if (isUsernameTeken)
            return res.status(401).send({message:"This username is alredy taken"})
        
        user = await User.create({
            email: req.body.email,
            password: req.body.password,
            username: req.body.email.split("@")[0],
            profilePic:req.body.profilePic || "https://www.pngitem.com/pimgs/m/678-6785829_my-account-instagram-profile-icon-hd-png-download.png"
        });

        const token = newToken(user);
        
        
        res.status(201).send({user,token,isAuth:true,message:"Register Success"})
    }
    catch (err) {
        return res.status(500).send({"error from api": err});
    }
};

const login = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send({ message: "user is not exist",isAuth:false });
        
        const match = user.comparePassword(req.body.password);
        //checkPassword also work
        //const match = user.checkPassword(req.body.password);

        if (!match)
            return res.status(402).send({ message: "incorrect password or email", isAuth:false })
        
        const token = newToken(user);

        
        user.password = null;
        return res.status(201).send({ user,token,isAuth:true, message:"Login Success" });
    }
    catch (err) {
        return res.status(500).send({"error from api": err});
    }
};


  


module.exports = { register, login };
