const express = require("express")
const { cloudinaryConfig, upload } = require('../cluodinaryMulter');
const { addCategory,getCategories ,updateCategory} = require("../controllers/categoryController")

const router = express.Router()

router.post("/addCategory", upload.single('image'),addCategory)
router.get("/getCategories",getCategories)
router.put('/updateCatgeory/:id',upload.single('image'),updateCategory)
// router.post("/signup", signupController)
// router.put("/updateUser", updateUser)

module.exports = router;