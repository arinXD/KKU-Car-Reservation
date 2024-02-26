var express = require('express');
var router = express.Router();
const models = require('../models');
const User = models.User

router.get("/", async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json({
            ok: true,
            data: users
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