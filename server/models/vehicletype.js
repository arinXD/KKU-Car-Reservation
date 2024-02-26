'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class VehicleType extends Model {

        static associate(models) {
            // define association here
        }
    }
    VehicleType.init({
        type_name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'VehicleType',
    });
    return VehicleType;
};