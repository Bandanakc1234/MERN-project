const router = require("express").Router()
const upload = require("./../../middleware/upload")
const { AddProduct, viewProduct, editProduct, AddReview, deleteProduct, SingleProductDetails, searchProduct } = require("./product.controller")
const authenticate = require("./../../middleware/authenticate")

router.post("/add_product",authenticate, upload.array("img"), AddProduct)

router.post("/add_review/:product_id", authenticate, AddReview)

router.get("/view_product", viewProduct)

router.get("/view_singleproductdetails/:id", SingleProductDetails)

router.put("/update_product/:product_id", authenticate, upload.array("img"), editProduct)

router.delete("/delete_product/:id",authenticate,  deleteProduct)

router.post("/search", searchProduct)

module.exports = router