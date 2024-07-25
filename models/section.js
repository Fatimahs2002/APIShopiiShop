const mongoose = require('mongoose');
const sectionSchema = new mongoose.Schema({
    name: { type: String, required: true ,unique: true},
    imageUrl: { type: String, required: false },
    imagePublicId: { type: String, required: false },
    // categoryId:{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Category',
    // }
  });

  const Section =  mongoose.model('Section', sectionSchema);

  module.exports = Section;