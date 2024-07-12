const express = require("express")

const { signinController, signupController, updateUser } = require("../controllers/userController")

const router = express.Router()

router.post("/signin", signinController)
router.post("/signup", signupController)
router.put("/updateUser", updateUser)

module.exports = router;