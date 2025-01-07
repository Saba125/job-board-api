import express from "express"
import applicationsController from "../controllers/applications/index.js"
import { authMiddleware } from "../middlewares/auth.js"
const router = express.Router()
router
  .route("/")
  .post(authMiddleware, applicationsController.createApplication)
  .get(authMiddleware, applicationsController.getApplications)
export default router
