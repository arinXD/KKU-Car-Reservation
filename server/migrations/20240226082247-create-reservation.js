'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Reservations', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                allowNull: true,
                defaultValue: null,
                unique: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            vehicle_id: {
                allowNull: true,
                defaultValue: null,
                unique: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Vehicles',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            sub_district: {
                type: Sequelize.STRING
            },
            district: {
                type: Sequelize.STRING
            },
            province: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            departure_date: {
                type: Sequelize.DATE
            },
            return_date: {
                type: Sequelize.DATE
            },
            passengers_number: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Reservations');
    }
};