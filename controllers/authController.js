const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

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
      { expiresIn: "1d" },
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

/* ===========================
   GET USERS COUNT
=========================== */
const getUsersCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "student" });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   FORGOT PASSWORD
=========================== */
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // Create reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px; border-radius: 12px; font-weight: bold; font-size: 24px;">
            AssessPro
          </div>
        </div>
        <h2 style="color: #1e293b; margin-bottom: 16px; text-align: center;">Password Reset Request</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 24px;">
          You are receiving this email because you (or someone else) has requested the reset of a password for your account. Please click the button below to reset your password.
        </p>
        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 16px;">
          <strong>Note:</strong> This link will expire in 10 minutes. If you did not request this, please ignore this email and your password will remain unchanged.
        </p>
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 16px;">
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} AssessPro. All rights reserved.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request - AssessPro",
        message: `Please reset your password by visiting: ${resetUrl}`,
        html: htmlMessage,
      });

      res
        .status(200)
        .json({ success: true, message: "Reset link sent to your email" });
    } catch (err) {
      console.error("❌ EMAIL SEND ERROR:", err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res
        .status(500)
        .json({ message: "Email could not be sent. Please try again later." });
    }
  } catch (error) {
    console.error("❌ FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   RESET PASSWORD
=========================== */
const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   UPDATE PROFILE
=========================== */
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json({
      message: "Profile updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   UPDATE PASSWORD
=========================== */
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Current password incorrect" });

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsersCount,
  forgotPassword,
  resetPassword,
  updateProfile,
  updatePassword,
};
