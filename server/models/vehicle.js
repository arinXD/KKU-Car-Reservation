'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Vehicle extends Model {

        static associate(models) {
            this.belongsTo(models.VehicleType, {
                foreignKey: 'vehicle_type_id',
                targetKey: 'id',
            });
            this.hasMany(models.Reservation, {
                foreignKey: 'vehicle_id',
                sourceKey: 'id',
            });
        }
    }
    Vehicle.init({
        vehicle_name: DataTypes.STRING,
        brand: DataTypes.STRING,
        img: DataTypes.STRING,
        model: DataTypes.STRING,
        seat: DataTypes.INTEGER,
        driver: DataTypes.STRING,
        license_code: DataTypes.STRING,
        reserve_status: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: 'Vehicle',
        paranoid: true,
        deletedAt: 'daletedAt',
    });
    return Vehicle;
};