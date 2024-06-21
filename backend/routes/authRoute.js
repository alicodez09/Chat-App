const express = require("express");
const {
  Register,
  verifyEmail,
  verifyPassword,
  userDetails,
  logout,
  updateUserDetails,
  filterUser,
} = require("../controllers/authController");
const router = express.Router();

// REGISTER USER || POST METHOD
router.post("/register", Register);

//VERIFY USER WITH EMAIL || POST METHOD
router.post("/verify-user-email", verifyEmail);

//VERIFY USER WITH PASSWORD || POST METHOD
router.post("/verify-user-password", verifyPassword);

// GET USER DETAILS || GET METHOD
router.get("/get-user-details", userDetails);

// UPDATE USER DETAILS || PUT METHOD
router.put("/update-user-details", updateUserDetails);

// Filter USER DETAILS || POST METHOD
router.post("/search-user", filterUser);

// LOGOUT || GET METHOD
router.get("/logout", logout);

module.exports = router;
