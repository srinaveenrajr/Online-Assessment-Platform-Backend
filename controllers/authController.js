const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ===========================
   REGISTER USER
=========================== */
const registerUser = async (req, res) => {
  try {
    console.log("👉 REGISTER API HIT");

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "You have already registered",
      });
    }

    const user = new User({
      name,
      email,
      password, // hashed automatically by pre-save hook
      role: "student",
    });

    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("❌ REGISTER ERROR:", error);

    // Mongo duplicate key error safety
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already registered",
      });
    }

    return res.status(500).json({
      message: "Registration failed",
    });
  }
};

/* ===========================
   LOGIN USER
=========================== */
const loginUser = async (req, res) => {
  try {
    console.log("👉 LOGIN API HIT");

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
