const mongoose = require('mongoose');
const subCategorySchema = new mongoose.Schema({
    name: { type: String, required: false,default:"category" },
    // imageUrl: { type: String, required: false },
    // imagePublicId: { type: String, required: false },
    categoryId: {
    type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
  },
  });

  const SubCategory =  mongoose.model('SubCategory', subCategorySchema);

  module.exports = SubCategory;