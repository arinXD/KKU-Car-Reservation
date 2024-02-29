var express = require('express');
var router = express.Router();
const models = require('../models');
const VehicleType = models.VehicleType

router.get("/", async (req, res) => {
    try {
        const types = await VehicleType.findAll({
            order: [
                ['id', 'DESC'],
            ]
        });
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
router.get("/vehicles", async (req, res) => {
    try {
        const types = await VehicleType.findAll({
            include: [{
                model: models.Vehicle,
            }, ],
            order: [
                ['id', 'DESC'],
            ]
        });
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

router.post("/", async (req, res) => {
    const data = req.body
    console.log(data);
    try {
        await VehicleType.create(data);
        return res.status(200).json({
            ok: true,
            message: "Insert success"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error"
        })
    }
})

router.put("/:id", async (req, res) => {
    const id = req.params.id
    const data = req.body
    try {
        await VehicleType.update(data, {
            where: {
                id: id,
            },
        });
        return res.status(200).json({
            ok: true,
            message: "Update succes."
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error"
        })
    }
})

router.delete("/:id", async (req, res) => {
    const id = req.params.id
    try {
        await VehicleType.destroy({
            where: {
                id
            },
        });
        return res.status(200).json({
            ok: true,
            message: "Delete succes."
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