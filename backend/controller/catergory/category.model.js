const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CategoryModel = new Schema({
    category_name : {
        type: String,
        required: true,
        trim: true
    }
},{timestamps: true})

const Category = mongoose.model("Category", CategoryModel)
module.exports = Category




