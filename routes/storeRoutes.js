const express = require("express")
const { cloudinaryConfig, upload } = require('../cluodinaryMulter');
const { addStore,getStores,approveStore,updateStore } = require("../controllers/storeController")

const router = express.Router()

router.post("/addStore", upload.single('image'),addStore)
router.get("/getStores",getStores)
router.put('/approvedStore/:storeId',approveStore)
router.put('/updateStore/:id',upload.single('image'),updateStore)
// router.post("/saveBeforeUpdate", upload.single('image'),saveBeforeUpdate);
// router.put('/approve',approve);
// router.put('/approveWithImage',approveWithImage)
// router.put('/reject',reject);
// router.post("/signup", signupController)
// router.put("/updateUser", updateUser)

module.exports = router;