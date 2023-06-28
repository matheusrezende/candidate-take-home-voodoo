"use strict";

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.changeColumn("games", "storeId", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    }),
  down: (queryInterface, Sequelize) =>
    queryInterface.changeColumn("games", "storeId", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    }),
};
