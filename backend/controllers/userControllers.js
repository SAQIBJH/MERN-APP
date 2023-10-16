const asyncHandler = require("express-async-handler");

const User = require("../models/userModel")

const generateToken = require("../config/generateToken");

// handling error for register user
const registerUser = asyncHandler(async (req,res) => {
    const { name, email, password, pic} = req.body;

    // check if user not provided any details and send response of error 
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the fields")
    }

    // checking if user is already exists
    const userExists = await User.findOne({ email });
    // we define email as unique

    // checking user exist or not
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // if not exist register the user
    const user = await User.create({
        name,
        email,
        password,
        pic
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
           token:generateToken(user._id),
        })
    }
    else {
        res.status(400);
        throw new Error("Failed to create new User")
    }
})

// for login
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    // check user is present? and check password will match with user so first we will hash the password for security purpose
    if (user && (await user.matchPassword(password)))
    { 
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
}) 

// /api/user -->end point
const allUsers = asyncHandler(async (req, res) => {
  const keywords = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // now find the user in DB
  // {$ne: req.user._id} iske allawa sare user jo h bcz yeh khud bhi hoga DB mein so iske allwa ke liye use kiye hain it will work after authorize user
    const users = await User.find(keywords).find({_id: { $ne: req.user._id },});
    res.send(users);
})
module.exports = {registerUser,authUser,allUsers};