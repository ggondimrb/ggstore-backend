import Sequelize, { Model } from "sequelize";

class CategoryProduct extends Model {
  static init(sequelize) {
    super.init(
      {
        category_id: Sequelize.INTEGER,
        product_id: Sequelize.INTEGER
      },
      {
        sequelize
      }
    );

    return this;
  }
}

export default CategoryProduct;
