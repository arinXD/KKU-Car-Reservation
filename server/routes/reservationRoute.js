var express = require('express');
var router = express.Router();
const models = require('../models');
const Reservation = models.Reservation


router.get("/", async (req, res) => {
    try {
        const reservations = await Reservation.findAll();
        return res.status(200).json({
            ok: true,
            data: reservations
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