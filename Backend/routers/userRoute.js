const express = require("express");
const router = express.Router();
const { loginUser, signupUser } = require("../controllers/userController");

// User Router does not require authentication

// Login
router.post("/login", loginUser);

// Signup
router.post("/signup", signupUser);

module.exports = router;