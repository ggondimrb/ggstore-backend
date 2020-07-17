"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("files", "product_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id"
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("files", "product_id");
  }
};
