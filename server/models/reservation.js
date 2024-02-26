'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {

    static associate(models) {
      // define association here
    }
  }
  
  Reservation.init({
    user_id: DataTypes.INTEGER,
    vehicle_id: DataTypes.INTEGER,
    sub_district: DataTypes.STRING,
    district: DataTypes.STRING,
    province: DataTypes.STRING,
    address: DataTypes.STRING,
    departure_date: DataTypes.DATE,
    return_date: DataTypes.DATE,
    passengers_number: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};