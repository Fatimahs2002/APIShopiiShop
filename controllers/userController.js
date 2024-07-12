const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const axios = require("axios")
const config = require("config")

const User = require("../models/user")


const signinController = async(req, res) => {
    if(req.body.googleAccessToken){
        // gogole-auth
        const {googleAccessToken} = req.body;

        axios
            .get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "Authorization": `Bearer ${googleAccessToken}`
            }
        })
            .then(async response => {
                const firstName = response.data.given_name;
                const lastName = response.data.family_name;
                const email = response.data.email;
                const picture = response.data.picture;

                const existingUser = await User.findOne({email})

                if (!existingUser) 
                return res.status(404).json({message: "User don't exist!"})

                const token = jwt.sign({
                    email: existingUser.email,
                    id: existingUser._id
                }, config.get("JWT_SECRET"), {expiresIn: "1h"})
        
                res
                    .status(200)
                    .json({result: existingUser, token})
                    
            })
            .catch(err => {
                res
                    .status(400)
                    .json({message: "Invalid access token!"})
            })
    }else{
        // normal-auth
        const {email, password} = req.body;
        if (email === "" || password === "") 
            return res.status(400).json({message: "Invalid field!"});
        try {
            const existingUser = await User.findOne({email})
    
            if (!existingUser) 
                return res.status(404).json({message: "User don't exist!"})
    
            const isPasswordOk = await bcrypt.compare(password, existingUser.password);
    
            if (!isPasswordOk) 
                return res.status(400).json({message: "Invalid credintials!"})
    
            const token = jwt.sign({
                email: existingUser.email,
                id: existingUser._id
            }, config.get("JWT_SECRET"), {expiresIn: "1h"})
    
            res
                .status(200)
                .json({result: existingUser, token})
        } catch (err) {
            res
                .status(500)
                .json({message: "Something went wrong!"})
        }
    }
  
}

const signupController = async(req, res) => {
    if (req.body.googleAccessToken) {
        const {googleAccessToken,role,} = req.body;

        axios
            .get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "Authorization": `Bearer ${googleAccessToken}`
            }
        })
            .then(async response => {
                const firstName = response.data.given_name;
                const lastName = response.data.family_name;
                const userName = firstName+lastName;
                const email = response.data.email;
                const role = req.body.role;
                const phoneNumber = req.body.phoneNumber;
                // const picture = response.data.picture;

                const existingUser = await User.findOne({email})

                if (existingUser) 
                    return res.status(400).json({message: "User already exist!"})

                const result = await User.create({verified:"true",email,userName,phoneNumber,role })

                const token = jwt.sign({
                    email: result.email,
                    id: result._id
                }, config.get("JWT_SECRET"), {expiresIn: "1h"})

                res
                    .status(200)
                    .json({result, token})
            })
            .catch(err => {
                res
                    .status(400)
                    .json({message: "Invalid access token!"})
            })

    } else {
      // normal form signup
      const {email, password, confirmPassword, firstName, lastName,phoneNumber,role} = req.body;

      try {
          if (email === "" || password === "" || firstName === "" || lastName === "" && password === confirmPassword && password.length >= 4) 
              return res.status(400).json({message: "Invalid field!"})

          const existingUser = await User.findOne({email})

          if (existingUser) 
              return res.status(400).json({message: "User already exist!"})

          const hashedPassword = await bcrypt.hash(password, 12)

          const result = await User.create({email, password: hashedPassword, firstName, lastName,phoneNumber,role})

          const token = jwt.sign({
              email: result.email,
              phoneNumber:result.phoneNumber,
              role:result.role,
              id: result._id
          }, config.get("JWT_SECRET"), {expiresIn: "1h"})

          res
              .status(200)
              .json({result, token})
      } catch (err) {
          res
              .status(500)
              .json({message: "Something went wrong!"})
      }

    }
}

// Assuming you have already set up your MongoDB connection and User model using Mongoose

// Controller function to update user
const updateUser = async (req, res) => {
    let { userId, phoneNumber, role } = req.body;
    
    // Map 'cutsomer' role to 'user' and 'admin' role to 'admin'
    if (role === 'cutsomer') {
      role = 'user';
    } else if (role === 'owner') {
      role = 'admin';
    }else{
        role='user'
    }
    
    try {
      // Find the user by ID and update their phone and role
      const user = await User.findByIdAndUpdate(userId, { phoneNumber, role }, { new: true });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      return res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  






module.exports = {
    signinController,
    signupController,
    updateUser
}