const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User  = require('../models/userModel');
const asyncHandler = require("express-async-handler")
//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser =asyncHandler(async (req,res)=>{
    const {username,email,password}=req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({email});
    console.log("UserAvailable : ",userAvailable);f
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered");
    }
    
    //Hash Password
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    console.log(`User created ${user}`);
    if(user){
        res.status(201).json({_id:user.id,email:user.email});
    }
    else{
        res.status(400);
        throw new Error("User data is not valid");
    }
    console.log("Hashed Password : ",hashedPassword);
    
});

//@desc Login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandotory");
    }
    const user = await User.findOne({email});
    //compare password with hashedpassword
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken = jwt.sign({
            user: {
                username : user.username,
                email:user.email,
                id: user.id,
            },   
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : "1m"} 
    );
        res.status(200).json({accessToken});
    }
    else{
        res.status(400);
        throw new Error("email or password in not valid");
    }

    
});

//@desc Current User info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req,res)=>{
    res.json(req.user);
})

module.exports ={registerUser,loginUser,currentUser};