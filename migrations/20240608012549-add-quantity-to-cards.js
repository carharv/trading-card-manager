"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Cards", "quantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Cards", "quantity");
  },
};
