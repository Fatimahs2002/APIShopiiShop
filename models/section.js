const mongoose = require('mongoose');
const sectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: false },
    imagePublicId: { type: String, required: false },
  });

  const Section =  mongoose.model('Section', sectionSchema);

  module.exports = Section;