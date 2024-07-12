const Item = require('../models/item');
const { cloudinaryConfig, upload } = require('../cluodinaryMulter');
const { io } = require('../io');

const cloudinary = cloudinaryConfig;

// Controller function to add an item
const addItem = async (req, res) => {
  try {
    const { file } = req;
  
    if (!file) {
      return res.status(400).json({ message: 'No image file provided!' });
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
      storeId: req.body.storeId,
      categoryId: req.body.categoryId,
      userId: req.body.userId,
      subCategory: req.body.subCategory
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




const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

module.exports = {
  addItem,getItems
};
