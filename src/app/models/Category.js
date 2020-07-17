import Sequelize, { Model } from "sequelize";

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING
      },
      {
        sequelize
      }
    );

    return this;
  }

  static associate(models) {
    models.Category.belongsToMany(models.Product, {
      through: "category_products",
      as: "products",
      foreignKey: "category_id",
      otherKey: "product_id"
    });
  }

  // static associate(models) {
  //   this.belongsToMany(models.Products, {
  //     through: models.CategoryProduct,
  //     as: "products",
  //     foreignKey: "categoryId",
  //     otherKey:"productId"
  //   });
  // }
}

export default Category;
