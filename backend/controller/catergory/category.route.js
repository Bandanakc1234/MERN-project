const router = require("express").Router()
// const upload = require("./../../middleware/upload")
const { addCategory, viewCategory, updateCategory, deleteCategory, editCategory, SingleCategoryDetails } = require("./category.controller")

router.post("/addcategory", addCategory)

router.get("/viewcategory", viewCategory)

router.get("/view_singlecategorydetails/:id", SingleCategoryDetails)

router.put("/update_category/:id", editCategory)

router.delete("/delete_category/:id", deleteCategory)

module.exports = router
