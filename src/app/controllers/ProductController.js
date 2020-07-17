import Product from "../models/Product";
import * as Yup from "yup";
import User from "../models/User";
import CategoryProduct from "../models/CategoryProduct";
import Category from "../models/Category";
import File from "../models/File";

class ProductController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const products = await Product.findAll({
      attributes: ["id", "title", "price", "stock"],
      limit: 20,
      offset: (page - 1) * 20,
      order: ["title"],
      include: [
        {
          model: Category,
          as: "categories",
          required: false,
          // Pass in the Product attributes that you want to retrieve
          attributes: ["id", "name"]
        },
        {
          model: File,
          as: "files",
          required: false,
          attributes: ["id", "name", "path", "url"]
        }
      ]
    });

    return res.json(products);
  }

  async indexOne(req, res) {
    const { page = 1 } = req.query;
    const product = await Product.findOne({
      where: { id: req.params.id },
      attributes: ["id", "title", "price", "stock"],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Category,
          as: "categories",
          required: false,
          attributes: ["id", "name"]
        },
        {
          model: File,
          as: "files",
          required: false,
          attributes: ["id", "name", "path", "url"]
        }
      ]
    });

    return res.json(product);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      price: Yup.number().required(),
      stock: Yup.number()
        .required()
        .min(1)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { title, price, stock, categories } = req.body;

    //check if provider_id is a provider
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    });

    if (!checkIsProvider) {
      return res
        .status(403)
        .json({ error: "You can only add products with providers" });
    }

    const checkTitleProduct = await Product.findOne({
      where: { title }
    });

    if (checkTitleProduct) {
      return res
        .status(403)
        .json({ error: "The title of product already exists" });
    }

    const newProduct = await Product.create({
      title,
      price,
      stock
    });

    if (categories) {
      categories.forEach(async item => {
        const cp = {
          category_id: item,
          product_id: newProduct.id
        };

        await CategoryProduct.create(cp);
      });
    }

    const fileProduct = await File.findOne({
      where: { user_id: req.userId, product_id: null }
    });

    if (fileProduct) {
      await File.update(
        { product_id: newProduct.id },
        { where: { user_id: req.userId, product_id: null } }
      );
    }

    return res.json({ title, price, stock, categories });
  }

  async delete(req, res) {
    const product = await Product.findByPk(req.params.id);

    //check if provider_id is a provider
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    });

    if (!checkIsProvider) {
      return res.status(401).json({
        error: "You don't have permission to remove this product"
      });
    }

    const productCategory = await CategoryProduct.findAll({
      where: { product_id: req.params.id }
    });

    productCategory.forEach(async item => {
      await item.destroy();
    });

    const file = await File.findAll({
      where: { product_id: req.params.id }
    });

    file.forEach(async item => {
      await item.destroy();
    });

    await product.destroy({ where: { id: req.params.id } });

    return res.json(product);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      price: Yup.number().required(),
      stock: Yup.number()
        .required()
        .min(1)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { id, title, price, stock, categories } = req.body;

    const productCategory = await CategoryProduct.findAll({
      where: { product_id: id }
    });

    productCategory.forEach(async item => {
      await item.destroy();
    });

    categories.forEach(async item => {
      const cp = {
        category_id: item,
        product_id: id
      };
      await CategoryProduct.create(cp);
    });

    await Product.update({ title, price, stock }, { where: { id } });

    res.status(200).json();
  }
}

export default new ProductController();
