const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getUsersCount, forgotPassword, resetPassword, updateProfile, updatePassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users/count", authMiddleware, adminMiddleware, getUsersCount);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/profile", authMiddleware, updateProfile);
router.put("/password", authMiddleware, updatePassword);

module.exports = router;
