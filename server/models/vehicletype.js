'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class VehicleType extends Model {

        static associate(models) {
            this.hasMany(models.Vehicle, {
                foreignKey: 'vehicle_type_id',
                sourceKey: 'id',
            });
        }
    }
    VehicleType.init({
        type_name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'VehicleType',
        paranoid: true,
        deletedAt: 'daletedAt',
    });
    return VehicleType;
};