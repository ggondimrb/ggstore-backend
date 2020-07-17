import Sequelize from "sequelize";

import User from "../app/models/User";
import File from "../app/models/File";
import Product from "../app/models/Product";
import Category from "../app/models/Category";
import CategoryProduct from "../app/models/CategoryProduct";

import databaseConfig from "../config/database";

const models = [User, File, Product, Category, CategoryProduct];

class Database {
  constructor() {
    this.init();
    //this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  // mongo() {
  //   this.mongoConnection = mongoose.connect(
  //     "mongodb://192.168.99.100:27017/gobarber",
  //     {
  //       useNewUrlParser: true,
  //       useFindAndModify: true
  //     }
  //   );
  // }
}

export default new Database();
