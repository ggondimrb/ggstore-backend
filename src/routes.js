import { Router } from "express";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import FileController from "./app/controllers/FileController";
import ProductController from "./app/controllers/ProductController";
import CategoryController from "./app/controllers/CategoryController";
import authMiddleware from "./app/middlewares/auth";
import multer from "multer";
import multerConfig from "./config/multer";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);
routes.get("/products", ProductController.index);
routes.get("/products/:id", ProductController.indexOne);
routes.get("/categories", CategoryController.index);
routes.get("/categories/:id", CategoryController.indexOne);

routes.use(authMiddleware);
// rotas que precisam do middleware
routes.put("/users", UserController.update);

//routes.get("/providers", ProviderController.index);
//routes.get("/providers/:providerId/available", AvailableController.index);

routes.post("/products", ProductController.store);
routes.put("/products", ProductController.update);
routes.delete("/products/:id", ProductController.delete);

routes.post("/categories", CategoryController.store);
routes.put("/categories/:id", CategoryController.update);
routes.delete("/categories/:id", CategoryController.delete);

routes.post("/files", upload.single("file"), FileController.store);

export default routes;
