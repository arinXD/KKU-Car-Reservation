var express = require('express');
var router = express.Router();
const models = require('../models');
const Vehicle = models.Vehicle
const multer = require('multer')
const path = require('path');

var fileName
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images/'))
    },
    filename: function (req, file, cb) {
        const postFix = file.originalname.split(".").pop()
        fileName = `${Date.now()}-vehicle.${postFix}`
        return cb(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error = new Error('Only image files (JPEG, PNG, JPG) are allowed!');
        cb(error, false);
    }
};

const upload = multer({
    storage,
    fileFilter
})


router.get("/", async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll({
            order: [
                ['id', 'DESC'],
            ]
        });
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
router.get("/types", async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll({
            include: [{
                model: models.VehicleType,
            }, ],
            order: [
                ['id', 'DESC'],
            ]
        });
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

router.get("/:id/types", async (req, res) => {
    const id = req.params.id
    try {
        const vehicle = await Vehicle.findOne({
            where: {
                id: id
            },
            // include: [{ model: models.VehicleType }]
        });
        return res.status(200).json({
            ok: true,
            data: vehicle
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error"
        })
    }
})

router.post("/", upload.single('image'), async (req, res) => {
    const data = req.body
    try {
        const img = `http://localhost:8000/images/${fileName}`
        data.img = img
        await Vehicle.create(data);
        return res.status(200).json({
            ok: true,
            message: "Insert succes."
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
        await Vehicle.destroy({
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

router.put("/:id/formendcode", upload.single('image'), async (req, res) => {
    const data = req.body
    const vid = req.params.id
    try {
        const img = `http://localhost:8000/images/${fileName}`
        data.img = img
        await Vehicle.update(data, {
            where: {
                id: vid,
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
router.put("/:id", async (req, res) => {
    const data = req.body
    const vid = req.params.id
    try {
        await Vehicle.update(data, {
            where: {
                id: vid,
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
router.put("/:id/status", async (req, res) => {
    const vid = req.params.id
    try {
        const vehicle = await Vehicle.findOne({
            where: {
                id: vid,
            },
        });

        vehicle.reserve_status = !vehicle.reserve_status
        await vehicle.save()

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

module.exports = router