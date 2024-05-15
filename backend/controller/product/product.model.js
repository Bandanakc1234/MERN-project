const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema


const ReviewSchema = new Schema({
    point: {
        type: Number,
        default: 1
    },
    msg: String,
    user: {
        type: ObjectId,
        ref: "user"
    }

}, { timestamps: true })

const ProductModel = new Schema({
    product_name: {
        type: String,
        required: true,
        trim: true
    },
    // product_category:{
    //     type: ObjectId,
    //     ref: "category"
    // },
    product_price: Number,
    product_color: String,
    product_description: String,
    product_model: String,
    product_size: String,
    product_tag: [String],
    product_discount: {
        discountedItem: Boolean,
        discountedType: {
            type: String,
            enum: ['percentage', 'quantity', 'value']
        },
        discountedValue: String
    },
    Offer:String,
    product_image: [String],
    product_manu: Date,
    product_expiry: Date,
    salesDate: Date,
    purchaseDate: Date,
    vendor: {
        type: ObjectId,
        ref: "user"
    },
    review: [ReviewSchema],
    warrentyStatus: Boolean,
    warrentyPeriod: String

}, { timestamps: true })

const Product = mongoose.model("Product", ProductModel)
module.exports = Product