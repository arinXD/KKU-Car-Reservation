'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Vehicles', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            vehicle_type_id: {
                allowNull: true,
                defaultValue: null,
                unique: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'VehicleTypes',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            vehicle_name: {
                type: Sequelize.STRING
            },
            brand: {
                type: Sequelize.STRING
            },
            seat: {
                type: Sequelize.INTEGER
            },
            driver: {
                type: Sequelize.STRING
            },
            license_code: {
                type: Sequelize.STRING
            },
            reserve_status: {
                type: Sequelize.BOOLEAN
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
        await queryInterface.dropTable('Vehicles');
    }
};