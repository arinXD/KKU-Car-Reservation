const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const session = require('express-session')
const {
    Sequelize
} = require('sequelize')
require("dotenv").config();
const app = express()

const reservation = require('./routes/reservation');
const userRouter = require('./routes/userRouter');
const vehicleRouter = require('./routes/vehicleRouter');
const vehicleTypeRouter = require('./routes/vehicleTypeRouter');

app.use(express.json());
app.use(cors())
app.use(cookieParser());
app.use(express.urlencoded({
    extended: false
}));
app.use(logger('dev'));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}))
app.use(express.static(path.join(__dirname, 'public')))

const port = 8000
const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD, {
        host: process.env.DATABASE_HOST,
        dialect: 'mysql',
        logging: false,
        timezone: '+07:00',
    },
)

app.listen(port, async () => {
    try {
        await sequelize.sync()
    } catch (err) {
        console.error(err);
        console.log("!!!!WARNING!!!!");
        console.log(` - Check database connection`);
    } finally {
        console.log(`Server listening on port ${port}`)
    }
})

app.get('/api', (req, res, next) => {
    return res.json({
        message: 'CP Car Reservation API'
    })
})

app.use('/api/users', userRouter);

app.use((req, res, next) => {
    return res.status(400).json({
        message: "400 bad request"
    })
});

module.exports = app;