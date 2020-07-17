import Category from "../models/Category";
import Product from "../models/Product";
import CategoryProduct from "../models/CategoryProduct";
import * as Yup from "yup";
import User from "../models/User";

class CategoryController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const categories = await Category.findAll({
      attributes: ["id", "name"],
      limit: 20,
      offset: (page - 1) * 20,
      order: ["name"],
      include: [
        {
          model: Product,
          as: "products",
          required: false,
          // Pass in the Product attributes that you want to retrieve
          attributes: ["id", "title"]
        }
      ]
    });

    return res.json(categories);
  }

  async indexOne(req, res) {
    const category = await Category.findOne({
      where: { id: req.params.id },
      attributes: ["id", "name"]
    });

    return res.json(category);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { name, products } = req.body;

    //check if provider_id is a provider
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    });

    if (!checkIsProvider) {
      return res
        .status(403)
        .json({ error: "You can only add Categorys with providers" });
    }

    const checkNameCategory = await Category.findOne({
      where: { name }
    });

    if (checkNameCategory) {
      return res
        .status(403)
        .json({ error: "The title of category already exists" });
    }

    const category = await Category.create({
      name
    });

    // req.body.products.forEach(async item => {
    //   const pc = {
    //     product_id: item,
    //     category_id: category.id
    //   };
    //   await CategoryProduct.create(pc);
    // });

    return res.json({ name, products });
  }

  async delete(req, res) {
    const category = await Category.findByPk(req.params.id);

    //check if provider_id is a provider
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    });

    if (!checkIsProvider) {
      return res.status(401).json({
        error: "You don't have permission to remove this category"
      });
    }

    const productCategory = await CategoryProduct.findAll({
      where: { category_id: req.params.id }
    });

    productCategory.forEach(async item => {
      await item.destroy();
    });

    await category.destroy({ where: { id: req.params.id } });

    return res.json(category);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { name } = req.body;

    await Category.update({ name }, { where: { id: req.params.id } });

    res.status(200).json();
  }
}

export default new CategoryController();
