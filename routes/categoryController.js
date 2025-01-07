import express from "express"
import categoryController from "../controllers/category/index.js"
import { authMiddleware } from "../middlewares/auth.js"
const router = express.Router()
router
  .route("/")
  .post(authMiddleware, categoryController.createCategory)
  .get(authMiddleware, categoryController.getAllCategories)
export default router
