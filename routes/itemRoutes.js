const express = require("express")
const { cloudinaryConfig, upload } = require('../cluodinaryMulter');
const { addItem,getItems,approveItem,updateItem,deleteItem } = require("../controllers/itemContoller")

const router = express.Router()

router.post("/addItem", upload.single('image'),addItem)
router.get("/getItems",getItems)
router.put('/approveItem/:itemId',approveItem)
// router.post("/signup", signupController)
// router.put("/updateUser", updateUser)
router.put('/updateItem/:id',upload.single('image'),updateItem);
router.delete('/deleteItem/:id',upload.single('image'),deleteItem);

module.exports = router;