const express = require("express")
const { cloudinaryConfig, upload } = require('../cluodinaryMulter');
const {addCategoryInStore,getCategoriesInSore ,deleteCategoryInStore,updateCategoryInStore,approveCategoryInStore,getCategoryByStoreId} = require("../controllers/CategoryInStoreController")

const router = express.Router()

// router.post("/addCategory", upload.single('image'),addCategory)
router.post("/addCategoryInStore",upload.single('image'),addCategoryInStore)
router.get('/getCategoriesInSore',getCategoriesInSore)
router.delete('/deleteCategoryInStore/:id',deleteCategoryInStore)
router.put('/updateCategoryInStore/:id',upload.single('image'),updateCategoryInStore)
router.put('/approveCategoryInStore/:id',approveCategoryInStore)
router.get('/getCategoryByStoreId/:StoreId',getCategoryByStoreId)
// router.post("/signup", signupController)
// router.put("/updateUser", updateUser)
///fatima
module.exports = router;