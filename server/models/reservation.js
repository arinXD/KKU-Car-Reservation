'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Reservation extends Model {

        static associate(models) {
            this.belongsTo(models.Vehicle, {
                foreignKey: 'vehicle_id',
                targetKey: 'id',
            });
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                targetKey: 'id',
            });
        }
    }

    Reservation.init({
        vehicle_id: DataTypes.INTEGER,
        sub_district: DataTypes.STRING,
        district: DataTypes.STRING,
        province: DataTypes.STRING,
        address: DataTypes.STRING,
        pick_up_point: DataTypes.STRING,
        departure_date: DataTypes.DATE,
        return_date: DataTypes.DATE,
        allow: DataTypes.BOOLEAN,
        passengers_number: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Reservation',
    });
    return Reservation;
};