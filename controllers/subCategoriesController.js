const SubCategory = require('../models/StoreCategory');
const { cloudinaryConfig, upload } = require('../cluodinaryMulter');
const { io } = require('../io');

const cloudinary = cloudinaryConfig;

// Controller function to add an item
const test = async (req, res) => {
    // const { id, categories } = req.body;
  const data = req.body;
  const categories = data.categories;
  const id = data.id;
  console.log(categories);
  console.log(id)
    try {
      // Ensure that 'categories' is an array
      if (!Array.isArray(categories)) {
        return res.status(400).json({ error: 'Categories must be an array' });
      }
  
      // Insert each category as a document
      const insertedCategories = await Promise.all(categories.map(async (category) => {
        const newSubCategory = new SubCategory({
          name : category,
          categoryId:id

        });
  
        // Save the new subcategory to the database
        return await newSubCategory.save();
      }));
  
      // Return the inserted categories
      res.json(insertedCategories);
    } catch (error) {
      console.error('Error inserting categories:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Start the server
  
  
const addSubcategory = async (req, res) => {
  try {
    const { file } = req;
  
    if (!file) {
      return res.status(400).json({ message: 'No image file provided!' });
    }

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      public_id: 'your_desired_public_id', // Set your desired public ID
    });

    // Create a new instance of the Item model with data from the request body
    const newSubCategory = new SubCategory({
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
    res.status(500).json({ message: error.message });
  }
};



const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message)
  }
}
// const getSubcategoriesByCategoryId = async (req, res) => {
//   try {
//     const { categoryId } = req.params.id; // Extract categoryId from request body

//     // Find subcategories by categoryId in the database
//     const subcategories = await SubCategory.find({ categoryId });

//     // Respond with the found subcategories
//     res.json(subcategories);
//   } catch (error) {
//     // Handle errors
//     console.error('Error fetching subcategories:', error.message);
//     res.status(500).json({ error: 'Failed to fetch subcategories' });
//   }
// };
const getSubcategoriesByCategoryId = async (req, res) => {
  const categoryId = req.params.id; // Access categoryId from req.params directly
  
  try {
    const subcategories = await SubCategory.find({ categoryId }); // Find subcategories by categoryId
    res.send(subcategories);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving subcategories."
    });
  }
};

module.exports = {
  test,getSubcategoriesByCategoryId,addSubcategory
};
