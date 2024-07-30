const CategoryInStore = require('../models/CategoryInStore.js');
const Item=require('../models/item');
const { cloudinaryConfig, upload } = require('../cluodinaryMulter');
const { io } = require('../io');
const mongoose = require('mongoose');
const cloudinary = cloudinaryConfig;
const User=require('../models/user.js');

// Controller function to add an item
const addCategoryInStore = async (req, res) => {
  try {
    const { file, body: { name, StoreId, userId } } = req;

    if (!file) {
      return res.status(400).json({ message: 'No image file provided!' });
    }

    const existingCategoryInStore = await CategoryInStore.findOne({ name, StoreId });
    if (existingCategoryInStore) {
      return res.status(400).json({ message: 'CategoryInStore with this name already exists in the store!' });
    }

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      public_id: 'your_desired_public_id', // Set your desired public ID
    });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Set approval status based on user role
    const isApproved = user.role !== 'magazineOwner';

    const newCategoryInStore = new CategoryInStore({
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      name,
      StoreId,
      approved: isApproved,
      userId: user._id,
    });

    const savedCategoryInStore = await newCategoryInStore.save();

    io.emit('newCategoryInStore', savedCategoryInStore);

    res.status(201).json({ message: 'CategoryInStore added successfully', item: savedCategoryInStore });
  } catch (error) {
    console.error('Error adding CategoryInStore:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//get category in Store
const getCategoriesInSore = async (req, res) => {
  try {
    const categoriesInStore = await CategoryInStore.find();
    res.json(categoriesInStore);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

//delete category
const deleteCategoryInStore = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID format!' });
    }

    // Find the category by ID
    const category = await CategoryInStore.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found!' });
    }

    // Find and delete all items associated with this category
    const itemsToDelete = await Item.find({ CategoryInStoreId: id });
    if (itemsToDelete.length > 0) {
      await Item.deleteMany({ CategoryInStoreId: id });
      itemsToDelete.forEach(item => {
        io.emit('deleteItem', item._id); // Emit item deletion event
        if (item.imagePublicId) {
          cloudinary.uploader.destroy(item.imagePublicId); // Delete item image
        }
      });
    }

    // Delete the category's image from Cloudinary if it exists
    if (category.imagePublicId) {
      await cloudinary.uploader.destroy(category.imagePublicId);
    }

    // Delete the category itself
    await CategoryInStore.findByIdAndDelete(id);

    // Emit the 'deleteCategoryInStore' event
    io.emit('deleteCategoryInStore', id);

    // Respond with a success message
    res.status(200).json({ message: 'Category and associated items deleted successfully' });
  } catch (error) {
    console.error('Error deleting category and associated items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//update category in store:
const updateCategoryInStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { file, body: { name, StoreId } } = req;

    // Find the category by ID
    const categoryInStore = await CategoryInStore.findById(id);
    if (!categoryInStore) {
      return res.status(404).json({ message: 'Category in store not found!' });
    }

    // Check if a new name is provided and if it's not taken by another category
    if (name && name !== categoryInStore.name) {
      const existingCategoryInStore = await CategoryInStore.findOne({ name });
      if (existingCategoryInStore) {
        return res.status(400).json({ message: 'Category in store with this name already exists!' });
      }
      categoryInStore.name = name;
    }

    // Update the StoreId if provided
    if (StoreId) {
      categoryInStore.StoreId = StoreId;
    }

    // Update the image if a new file is provided
    if (file) {
      // Delete the old image from Cloudinary
      await cloudinary.uploader.destroy(categoryInStore.imagePublicId);

      // Upload the new image
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        public_id: `category_${id}`, // Set your desired public ID
      });

      // Update the category with the new image URL and public ID
      categoryInStore.imageUrl = uploadResult.secure_url;
      categoryInStore.imagePublicId = uploadResult.public_id;
    }

    // Save the updated category
    const updatedCategoryInStore = await categoryInStore.save();

    // Emit the 'updateCategoryInStore' event after updating the category
    io.emit('updateCategoryInStore', updatedCategoryInStore);

    // Respond with the updated category
    res.status(200).json({ message: 'Category in store updated successfully', categoryInStore: updatedCategoryInStore });
  } catch (error) {
    console.error('Error updating category in store:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
//aprove category in Store
const approveCategoryInStore = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCategoryInStore= await CategoryInStore.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );

    if (!updatedCategoryInStore) {
      return res.status(404).json({ message: 'Category in store  not found' });
    }

    res.status(200).json({ message: 'Category  in store approved successfully', CategoryInStore: updatedCategoryInStore });
  } catch (error) {
    console.error('Error approving category in store:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Get category in store by storeId
const getCategoryByStoreId = async (req, res) => {
  const { StoreId } = req.params;

  try {
    // Corrected the population field to match the model field name
    const categories = await CategoryInStore.find({ StoreId })
    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found for this store",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Categories found",
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories by StoreId:', error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
module.exports = {
addCategoryInStore,getCategoriesInSore,deleteCategoryInStore,updateCategoryInStore,approveCategoryInStore,getCategoryByStoreId
};
