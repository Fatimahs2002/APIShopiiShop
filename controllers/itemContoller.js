const Item = require('../models/item');
const { cloudinaryConfig, upload } = require('../cluodinaryMulter');
const { io } = require('../io');
const mongoose = require('mongoose');

const cloudinary = cloudinaryConfig;

// Controller function to add an item
const addItem = async (req, res) => {
  try {
    const { file ,body: { name }} = req;
  
    if (!file) {
      return res.status(400).json({ message: 'No image file provided!' });
    }
    const existingItem = await Item.findOne({ name });
    if (existingItem) {
      return res.status(400).json({ message: 'Item with this name already exists!' });
    }
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      public_id: 'your_desired_public_id', // Set your desired public ID
    });

    // Create a new instance of the Item model with data from the request body
    const newItem = new Item({
      imageUrl: uploadResult.secure_url, // Add image URL to the post
      imagePublicId: uploadResult.public_id, // Add image public ID to the post
      name: req.body.name,
      ingredients: req.body.ingredients,
      pPrice: req.body.pPrice,
      sPrice: req.body.sPrice,
      userId: req.body.userId,
      CategoryInStoreId:req.body.CategoryInStoreId
 //krj3ora2o04kfeee1bo8.jpg
      // Other fields like reviews, rating, isPopular, and isRecommended will use default values
    });

    // Save the new item to the database
    const savedItem = await newItem.save();

    // Emit the 'newItem' event after saving the item
    io.emit('newItem', savedItem);

    // Respond with the saved item
    res.status(201).json({ message: 'Item added successfully', item: savedItem });
  } catch (error) {
    console.error('Error adding item:', error.message);
    res.status(500).json({ error: error.message});
  }
};
//aprove Item
const approveItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { approved: true },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item approved successfully', item: updatedItem });
  } catch (error) {
    console.error('Error approving item:', error.message);
    res.status(500).json({ error: error.message });
  }
};


//updateItem
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { file, body: { name, ingredients, pPrice, sPrice, CategoryInStoreId } } = req;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid item ID format!' });
    }

    // Find the item by ID
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found!' });
    }

    // Check if a new name is provided and if it's not taken by another item
    if (name && name !== item.name) {
      const existingItem = await Item.findOne({ name });
      if (existingItem) {
        return res.status(400).json({ message: 'Item with this name already exists!' });
      }
      item.name = name;
    }

    // Update other fields if provided
    if (ingredients) item.ingredients = ingredients;
    if (pPrice) item.pPrice = pPrice;
    if (sPrice) item.sPrice = sPrice;
    if (CategoryInStoreId) item.CategoryInStoreId = CategoryInStoreId;

    // Update the image if a new file is provided
    if (file) {
      // Delete the old image from Cloudinary
      await cloudinary.uploader.destroy(item.imagePublicId);

      // Upload the new image
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        public_id: 'your_updated_public_id', // Set your desired public ID
      });

      // Update the section with the new image URL and public ID
      item.imageUrl = uploadResult.secure_url;
      item.imagePublicId = uploadResult.public_id;
    }

    // Save the updated item
    const updatedItem = await item.save();

    // Emit the 'updateItem' event after updating the item
    io.emit('updateItem', updatedItem);

    // Respond with the updated item
    res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
//delete Item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid item ID format!' });
    }

    // Find the item by ID
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found!' });
    }

    // If the item has an associated image, delete it from Cloudinary
    if (item.imagePublicId) {
      await cloudinary.uploader.destroy(item.imagePublicId);
    }

    // Delete the item from the database
    await Item.findByIdAndDelete(id);

    // Emit the 'deleteItem' event after deleting the item
    io.emit('deleteItem', id);

    // Respond with a success message
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

module.exports = {
  addItem,getItems,approveItem,updateItem,deleteItem
};
