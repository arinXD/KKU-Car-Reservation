'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {

        static associate(models) {
            this.hasMany(models.Reservation, {
                foreignKey: 'user_id',
                sourceKey: 'id',
            });
        }
    }
    User.init({
        email: DataTypes.STRING,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        role: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};