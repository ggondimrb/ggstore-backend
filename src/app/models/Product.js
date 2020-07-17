import Sequelize, { Model } from "sequelize";

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        price: Sequelize.DECIMAL(10, 2),
        stock: Sequelize.INTEGER
      },
      {
        sequelize
      }
    );

    return this;
  }

  static associate(models) {
    models.Product.belongsToMany(models.Category, {
      through: "category_products",
      as: "categories",
      foreignKey: "product_id",
      otherKey: "category_id"
    });

    models.Product.hasMany(models.File, { as: "files" });
  }

  // static associate(models) {
  //   Product.belongsToMany(models.Category, {
  //     through: "CategoryProduct",
  //     as: "categories",
  //     foreignKey: "productId",
  //     otherKey: "categoryId"
  //   });
  // }
}

export default Product;
