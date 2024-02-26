'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Vehicle extends Model {

        static associate(models) {
            // define association here
        }
    }
    Vehicle.init({
        vehicle_type_id: DataTypes.INTEGER,
        vehicle_name: DataTypes.STRING,
        brand: DataTypes.STRING,
        seat: DataTypes.INTEGER,
        driver: DataTypes.STRING,
        license_code: DataTypes.STRING,
        reserve_status: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: 'Vehicle',
    });
    return Vehicle;
};