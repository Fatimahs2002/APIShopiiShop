const Category = require('../models/category');
const { cloudinaryConfig, upload } = require('../cluodinaryMulter');
const { io } = require('../io');

const cloudinary = cloudinaryConfig;

// Controller function to add an item
const addCategory = async (req, res) => {
  try {
    const { file } = req;
  
    if (!file) {
      return res.status(400).json({ message: 'No image file provided!' });
    }

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      public_id: 'your_desired_public_id', // Set your desired public ID
    });

    // Create a new instance of the Item model with data from the request body
    const newCategory = new Category({
      imageUrl: uploadResult.secure_url, // Add image URL to the post
      imagePublicId: uploadResult.public_id, // Add image public ID to the post
      name: req.body.name,
     sectionId: req.body.sectionId
      // Other fields like reviews, rating, isPopular, and isRecommended will use default values
    });

    // Save the new item to the database
    const savedCategory = await newCategory.save();

    // Emit the 'newItem' event after saving the item
    // console.log('New item emitted:', savedItem); // Log the emitted item data
    io.emit('newCategory', savedCategory);

    // Respond with the saved item
    res.status(201).json({ message: 'category added successfully', item: savedCategory });
  } catch (error) {
    console.error('Error adding category:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

module.exports = {
  addCategory,getCategories
};
