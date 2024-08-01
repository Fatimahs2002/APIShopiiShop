const Store = require('../models/store');
const { cloudinaryConfig, upload } = require('../cluodinaryMulter');
const { io } = require('../io');
const Image = require('../models/image');
const cloudinary = cloudinaryConfig;
var mongoose = require('mongoose');
const User=require("../models/user.js");
// Controller function to add an item
const addStore = async (req, res) => {
  try {
    const { file, body: { 
      name, 
      currency, 
      address, 
      deliveryTime, 
      whatTheySell, 
      rating, 
      reviews, 
      openUntil, 
      exchangeRate, 
      userId, 
      requestedCategories // Added this line
    }} = req;
  
    if (!file) {
      return res.status(400).json({ message: 'No image file provided!' });
    }

    const existingStore = await Store.findOne({ name });
    if (existingStore) {
      return res.status(400).json({ message: 'Store with this name already exists!' });
    }

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      public_id: 'your_desired_public_id', // Set your desired public ID
    });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const isApproved = user.role === 'superAdmin';
    // const isApproved = user.role === 'admin'; // Uncomment this if you want to use admin role

    // Create a new instance of the Store model with data from the request body
    const newStore = new Store({
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      name,
      currency,
      address,
      deliveryTime,
      whatTheySell,
      rating,
      reviews,
      openUntil,
      exchangeRate,
      approved: isApproved,
      userId: user._id,
      requestedCategories // Added this line
    });

    // Save the new store to the database
    const savedStore = await newStore.save();

    // Emit the 'newStore' event after saving the store
    io.emit('newStore', savedStore);

    // Respond with the saved store
    res.status(201).json({ message: 'Store added successfully', store: savedStore });
  } catch (error) {
    console.error('Error adding store:', error);
    res.status(500).json({ error: error.message });
  }
};


const approveStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      return res.status(400).json({ message: 'Invalid store ID format!' });
    }

    const updatedStore = await Store.findByIdAndUpdate(
      storeId,
      { approved: true },
      { new: true }
    );

    if (!updatedStore) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.status(200).json({ message: 'Store approved successfully', store: updatedStore });
  } catch (error) {
    console.error('Error approving store:', error.message);
    res.status(500).json({ error: 'An error occurred while approving the store' });
  }
};
//update Store
const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { file, body: { name, currency, address, deliveryTime, rating,reviews,openUntil,exchangeRate,whatTheySell} } = req;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid item ID format!' });
    }

    // Find the item by ID
    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found!' });
    }

    // Check if a new name is provided and if it's not taken by another item
    if (name && name !== store.name) {
      const existingStore = await Store.findOne({ name });
      if (existingStore) {
        return res.status(400).json({ message: 'Store with this name already exists!' });
      }
      store.name = name;
    }

    // Update other fields if provided
    if (currency) store.currency = currency;
    if (address) store.address = address;
    if (deliveryTime) store.deliveryTime= deliveryTime;
    if (rating) store.rating = rating;
    if(reviews) store.reviews=reviews;
    if(openUntil) store.openUntil=openUntil;
if(exchangeRate ) store.exchangeRate=exchangeRate;
if(whatTheySell) store.whatTheySell=whatTheySell;
    // Update the image if a new file is provided
    if (file) {
      // Delete the old image from Cloudinary
      await cloudinary.uploader.destroy(store.imagePublicId);

      // Upload the new image
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        public_id: 'your_updated_public_id', // Set your desired public ID
      });

      // Update the section with the new image URL and public ID
      store.imageUrl = uploadResult.secure_url;
      store.imagePublicId = uploadResult.public_id;
    }

    // Save the updated item
    const updatedStore = await store.save();

    // Emit the 'updateItem' event after updating the item
    io.emit('updateStore', updatedStore);

    // Respond with the updated item
    res.status(200).json({ message: 'Store updated successfully', store: updatedStore });
  } catch (error) {
    console.error('Error updating store:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

const approveWithImage = async (req, res) => {
  const id = req.body.id;
  const approved = req.body.approved;
  const imgUrl = req.body.imageUrl;
  // Update the store with the sent data
  Store.findByIdAndUpdate(id, { approved: approved ,imageUrl: imgUrl }, { new: true })
   .then(updatedStore => {
      res.status(200).json({ message: updatedStore });
    })
   .catch(error => {
      res.status(500).json({ message: 'Error updating store' });
    });
  };
const approve = async (req, res) => {
  const id = req.body.id;
  const approved = req.body.approved;

  // Update the store with the sent data
  Store.findByIdAndUpdate(id, { approved: approved }, { new: true })
   .then(updatedStore => {
      res.status(200).json({ message: updatedStore });
    })
   .catch(error => {
      res.status(500).json({ message: 'Error updating store' });
    });
};

const saveBeforeUpdate = async (req, res) => {
  try {
    const { file, body: { content } } = req;

    // Check if a file is provided
    if (!file) {
      return res.status(400).json({ message: 'No image file provided!' });
    }

    // Upload the image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      public_id: 'your_desired_public_id', // Set your desired public ID
    });

    // Create a new Image document with the uploaded image URL and public ID
    const newImage = new Image({
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id
    });

    // Save the new Image document
    await newImage.save();

    // Emit an event with the new image details
    io.emit('newImageBeforeUpdate', newImage);

    // Respond with the newImage details
    res.status(201).json(newImage);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

const reject= async (req, res) => {
  const id = req.body.id;
  const approved = req.body.approved;

  // Update the store with the sent data
  Store.findByIdAndUpdate(id, { approved: approved }, { new: true })
   .then(updatedStore => {
      res.status(200).json({ message: updatedStore });
    })
   .catch(error => {
      res.status(500).json({ message: error });
      console.log(error)
    });
};

module.exports = {
  addStore,
  getStores,
  approveStore,
  updateStore,
  reject,
  saveBeforeUpdate,
  approve,
  approveWithImage



};
