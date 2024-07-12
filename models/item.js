const mongoose = require('mongoose');

const item = new mongoose.Schema({
  imageUrl: { type: String, required: false },
  imagePublicId: { type: String, required: false },
  name: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  pPrice: {
    type: Number,
    required: true,
  },
  sPrice: {
    type: Number,
    required: true,
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
  },
  reviews: {
    type: [String], // Define an array of strings
    required: false,
   default: ['']
  },
  rating:{
    type:Number,
    default:0
  },
  isPopular:{
type:Boolean,
default:false
  },
  isRecommended:{
type:Boolean,
default:false
  },
  currentlyViewed:{
    type:Boolean,
    default:false
      },
  subCategory:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subCategory',
  }
}, { timestamps: true });

const Item = mongoose.model('Itemm', item);

module.exports = Item;
