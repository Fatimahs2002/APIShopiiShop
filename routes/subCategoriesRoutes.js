const express = require("express")
const { cloudinaryConfig, upload } = require('../cluodinaryMulter');
const { test,getSubcategoriesByCategoryId } = require("../controllers/subCategoriesController")

const router = express.Router()

// router.post("/addCategory", upload.single('image'),addCategory)
router.post("/test",test)
router.get("/getSubcategoriesByCategoryId/:id",getSubcategoriesByCategoryId)
// router.post("/signup", signupController)
// router.put("/updateUser", updateUser)

module.exports = router;