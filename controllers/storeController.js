const Store = require('../models/store');
const { cloudinaryConfig, upload } = require('../cluodinaryMulter');
const { io } = require('../io');
const Image = require('../models/image');
const cloudinary = cloudinaryConfig;

// Controller function to add an item
const addStore = async (req, res) => {
  try {
    const { file } = req;
  
    if (!file) {
      return res.status(400).json({ message: 'No image file provided!' });
    }

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      public_id: 'your_desired_public_id', // Set your desired public ID
    });

    // Create a new instance of the Item model with data from the request body
    const newStore = new Store({
      imageUrl: uploadResult.secure_url, // Add image URL to the post
      imagePublicId: uploadResult.public_id, // Add image public ID to the post
      name: req.body.name,
      currency: req.body.currency,
      address: req.body.address,
      deliveryTime: req.body.deliveryTime,
      whatTheySell: req.body.whatTheySell,
      rating: req.body.rating,
      reviews: req.body.reviews,
      openUntil: req.body.openUntil,
      exchangeRate: req.body.exchangeRate,
      sectionId: req.body.sectionId,
    //   approved : req.body.approved
      // Other fields like reviews, rating, isPopular, and isRecommended will use default values
    });

    // Save the new item to the database
    const savedStore = await newStore.save();

    // Emit the 'newItem' event after saving the item
    // console.log('New item emitted:', savedItem); // Log the emitted item data
    io.emit('newStore', savedStore);

    // Respond with the saved item
    res.status(201).json({ message: 'store added successfully', store: savedStore });
  } catch (error) {
    console.error('Error adding store:', error);
    res.status(500).json({ error: error.message });
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
      res.status(500).json({ message: 'Error updating store' });
    });
};

module.exports = {
  addStore,getStores,approveWithImage,approve,saveBeforeUpdate,reject
};
