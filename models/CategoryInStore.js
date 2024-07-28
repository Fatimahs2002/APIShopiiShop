const mongoose = require('mongoose');
const CategoryInStoreSchema = new mongoose.Schema({
    name: { type: String, required: false,default:"CategoryInStore" },
    imageUrl: { type: String, required: false },
    imagePublicId: { type: String, required: false },
    StoreId: {
      type: mongoose.Schema.Types.ObjectId,
        ref: 'store.js',
    },
    approved:{
      type:Boolean,
      default:true

    },
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  });

  const CategoryInStore=  mongoose.model('CategoryInStoreSchema', CategoryInStoreSchema);

  module.exports = CategoryInStore;