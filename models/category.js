const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name: { type: String, required: false,default:"category" },
    imageUrl: { type: String, required: false },
    imagePublicId: { type: String, required: false },
    sectionId: {
    type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
  },


  });

  const Category =  mongoose.model('Category', categorySchema);

  module.exports = Category;