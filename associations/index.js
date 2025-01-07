import Application from "../models/Application.js"
import Category from "../models/Category.js"
import Listing from "../models/Listing.js"
import User from "../models/User.js"

const createAssociation = () => {
  // Application's associations
  Application.belongsTo(Listing, { foreignKey: "listing_id" })
  Application.belongsTo(User, { foreignKey: "user_id" })
  //   Listings association
  Listing.belongsTo(User, { foreignKey: "user_id" })
  Listing.belongsTo(Category, { foreignKey: "category_id" })
}
export default createAssociation
