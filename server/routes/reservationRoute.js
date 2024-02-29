var express = require('express');
var router = express.Router();
const models = require('../models');
const Reservation = models.Reservation
const Vehicle = models.Vehicle

router.get("/", async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            include: [{
                    model: models.User,
                },
                {
                    model: models.Vehicle,
                    paranoid: false,
                    include: [{
                        model: models.VehicleType
                    }, ]
                },
            ],
            order: [['id', 'DESC'],]
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

router.put("/:id/allow", async (req, res) => {
    const rid = req.params.id
    const { allow } = req.body
    try{
        const reservation = await Reservation.findOne({ 
            where:{ id: rid},
            include: [{
                model: models.Vehicle,
                paranoid: false,
            },
            ],
        },)
        const cid = reservation.dataValues.Vehicle.id
        const vehicle = await Vehicle.findOne({ where:{ id: cid} })
        
        let message
        if(allow){
            if(vehicle.dataValues?.reserve_status){
                return res.status(200).json({
                    ok: false,
                    message: "สถานะรถไม่ว่าง"
                })
            }
            vehicle.reserve_status = true
            await vehicle.save()

            reservation.allow = allow
            await reservation.save()
            message = "ยืนยันการจองเรียบร้อย"
        }else{
            message = "ปฎิเสธการจอง"
            reservation.allow = allow
            await reservation.save()
        }
        return res.status(201).json({
            ok: true,
            message
        })
    }catch(err){
        console.error(err);
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
                    paranoid: false,
                    include: [{
                        model: models.VehicleType
                    }]
                },
            ],
            order: [['id', 'DESC'],]
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