const express = require("express")
const { cloudinaryConfig, upload } = require('../cluodinaryMulter');
const { addCategory,getCategories ,updateCategory,approveCategory} = require("../controllers/categoryController")

const router = express.Router()

router.post("/addCategory", upload.single('image'),addCategory)
router.get("/getCategories",getCategories)
router.put('/updateCatgeory/:id',upload.single('image'),updateCategory)
router.put('/approveCategory/:categoryId',approveCategory)

// router.post("/signup", signupController)
// router.put("/updateUser", updateUser)

module.exports = router;