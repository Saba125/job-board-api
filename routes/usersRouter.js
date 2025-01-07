import express from "express"
import usersController from "../controllers/users/index.js"
import { authMiddleware } from "../middlewares/auth.js"
const router = express.Router()
router.post("/register", usersController.register)
router.post("/login", usersController.login)
router.get("/showMe", authMiddleware, usersController.showMe)
export default router
