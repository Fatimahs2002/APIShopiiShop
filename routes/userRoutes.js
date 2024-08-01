const express = require("express");

const { signinController, signupController, updateUser, updateUserPhoneRole } = require("../controllers/userController");

const router = express.Router();

// User authentication routes
router.post("/signin", signinController);
router.post("/signup", signupController);

// Update user information
router.put("/updateUser", updateUser);

// Update phone and role of user by userId sent in the request body
router.put('/phoneRole', updateUserPhoneRole);

module.exports = router;
