var express = require('express');
var router = express.Router();
const models = require('../models');
const Reservation = models.Reservation

router.get("/", async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            include: [{
                    model: models.User,
                },
                {
                    model: models.Vehicle,
                    include: [{
                        model: models.VehicleType
                    }, ]
                },
            ],
        });
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
router.post("/", async (req, res) => {
    const reservData = req.body.data
    if (Object.values(reservData).filter(e => e).length = 0) {
        return res.status(401).json({
            ok: false,
            message: "Provide data"
        })
    }
    const insertData = reservData
    try {
        const reservations = await Reservation.create(insertData);
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
router.get("/users/:id", async (req, res) => {
    const userId = req.params.id
    try {
        const reservations = await Reservation.findAll({
            include: [{
                    model: models.User,
                    where: {
                        id: userId
                    },
                },
                {
                    model: models.Vehicle,
                    include: [{
                        model: models.VehicleType
                    }]
                },
            ],
        });
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