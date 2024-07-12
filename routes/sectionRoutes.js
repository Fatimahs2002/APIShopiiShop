const express = require("express")
const { cloudinaryConfig, upload } = require('../cluodinaryMulter');
const { addSection,getSections } = require("../controllers/sectionController")

const router = express.Router()

router.post("/addSection", upload.single('image'),addSection)
router.get("/getSections",getSections)
// router.post("/signup", signupController)
// router.put("/updateUser", updateUser)

module.exports = router;