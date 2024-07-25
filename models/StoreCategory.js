const mongoose = require('mongoose');
const StoreCategorySchema = new mongoose.Schema({
    name: { type: String, required: false,default:" StoreCategory" },
    // imageUrl: { type: String, required: false },
    // imagePublicId: { type: String, required: false },
    StoreId: {
      type: mongoose.Schema.Types.ObjectId,
        ref: 'store.js',
    },
  });

  const StoreCategory =  mongoose.model('StoreCategory', StoreCategorySchema);

  module.exports = StoreCategory;