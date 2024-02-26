var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const models = require('../models');
const User = models.User
require("dotenv").config();

router.post("/signin/google", async (req, res) => {
    const { signUserData } = req.body
    let userData
    try {
        const { email, firstName, lastName } = jwt.verify(signUserData, process.env.TOKEN_KEY);
        userData = {
            email, firstName, lastName
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: "Wrong SIGNATURE KEY!"
        })
    }
    try {
        const users = await User.findOne({ where: { email: userData?.email }});
        if(users){
            return res.status(200).json({
                ok: true,
                data: users
            })
        }

        const newUser = await User.create(userData)

        return res.status(200).json({
            ok: true,
            data: newUser
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error"
        })
    }
})


module.exports = router