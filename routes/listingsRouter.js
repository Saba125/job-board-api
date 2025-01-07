import listingController from "../controllers/listings/index.js"
import express from "express"
import { authMiddleware } from "../middlewares/auth.js"
const router = express.Router()
router
  .route("/")
  .post(authMiddleware, listingController.createListing)
  .get(authMiddleware, listingController.getAllListings)

router
  .route("/:id")
  .get(authMiddleware, listingController.getSingleListing)
  .delete(authMiddleware, listingController.deleteListing)
export default router
