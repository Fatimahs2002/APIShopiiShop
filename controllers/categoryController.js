const Category = require('../models/category');
const { cloudinaryConfig, upload } = require('../cluodinaryMulter');
const { io } = require('../io');

const cloudinary = cloudinaryConfig;

// Controller function to add an item
const addCategory = async (req, res) => {
  try {
    const { file,body: { name }  } = req;
  
    if (!file) {
      return res.status(400).json({ message: 'No image file provided!' });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists!' });
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


const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { file, body: { name } } = req;

    // Find the sectio by ID
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found!' });
    }

    // Check if a new name is provided and if it's not taken by another section
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists!' });
      }
      category.name = name;
    }

    // Update the image if a new file is provided
    if (file) {
      // Delete the old image from Cloudinary
      await cloudinary.uploader.destroy(category.imagePublicId);

      // Upload the new image
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        public_id: 'your_updated_public_id', // Set your desired public ID
      });

      // Update the section with the new image URL and public ID
      category.imageUrl = uploadResult.secure_url;
      category.imagePublicId = uploadResult.public_id;
    }

    // Save the updated section
    const updatedCategory = await category.save();

    // Emit the 'updateSection' event after updating the section
    io.emit('updateCategory', updatedCategory);

    // Respond with the updated section
    res.status(200).json({ message: 'Category updated successfully', category: updatedCategory});
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  addCategory,getCategories,updateCategory
};
