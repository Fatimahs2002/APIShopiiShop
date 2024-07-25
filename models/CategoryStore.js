const mongoose = require('mongoose');
const CategoryStoreSchema = new mongoose.Schema({
 
    StoreId: {
      type: mongoose.Schema.Types.ObjectId,
        ref: 'store.js',
    },
    CategoryId: {
     type: mongoose.Schema.Types.ObjectId,
       ref: 'category.js',
   },
  });

  const CategoryStore =  mongoose.model('CategoryStore ', CategoryStoreSchema);

  module.exports = CategoryStore;