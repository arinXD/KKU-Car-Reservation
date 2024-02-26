var express = require('express');
var router = express.Router();
const models = require('../models');
const Vehicle = models.Vehicle

router.get("/", async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll();
        return res.status(200).json({
            ok: true,
            data: vehicles
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