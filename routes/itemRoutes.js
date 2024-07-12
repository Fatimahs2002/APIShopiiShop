const express = require("express")
const { cloudinaryConfig, upload } = require('../cluodinaryMulter');
const { addItem,getItems } = require("../controllers/itemContoller")

const router = express.Router()

router.post("/addItem", upload.single('image'),addItem)
router.get("/getItems",getItems)
// router.post("/signup", signupController)
// router.put("/updateUser", updateUser)

module.exports = router;