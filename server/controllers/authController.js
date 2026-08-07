import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const RegisterUser = async(req,res)=>{
    const {name,email,password,role,adminPassword} = req.body;
    try{
        if(role === 'admin'){
            if(adminPassword !== process.env.ADMIN_SECRET_KEY){
                return res.status(400).json({message:"Invalid Admin Secret Key"});
            }
            else{
                console.log("Admin Registration Attempt with Valid Secret Key");
            }
        }
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User Already Exists"}); 
    }
    const hashedPassword = await bcrypt.hash(password,10);
    user = new User({
        name,
        email,
        password:hashedPassword,
        role
    });
    await user.save();
    const payload = {
        user:{
            id:user.id,
            role:user.role
        }
    };
    jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'},(err,token)=>{
        if(err) throw err;
        res.json({token});
    }); 

        res.status(201).json({message:"User Registered Successfully"},user);
}
catch(error){
    console.error("Error in registerUser",error);
    res.status(500).json({message:"Server Error"}); 
}
}

    
export const LoginUser = async(req,res)=>{
    const {email,password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        const payload = {
            user:{
                id:user.id,
                role:user.role
            }
        };
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'});    

        if(user){
            return res.status(201).json({message:"User Logged In Successfully", token,user});
        }
    }
    catch(error){
        console.error("Error in LoginUser",error);
        res.status(500).json({message:"Server Error"});
    }
}