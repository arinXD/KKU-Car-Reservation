var express = require('express');
var router = express.Router();
const models = require('../models');
const VehicleType = models.VehicleType

router.get("/", async (req, res) => {
    try {
        const types = await VehicleType.findAll();
        return res.status(200).json({
            ok: true,
            data: types
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

