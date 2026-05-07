const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/sign-in", async (req, res) => {
  console.log("Incoming request to /sign-in");
  console.log("Request body:", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log("Password mismatch for:", email);
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "User signed in",
      token,
    });
  } catch (err) {
    console.error("Unexpected error in /sign-in:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/sign-up", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (await User.findOne({ email })) {
    return res
      .status(409)
      .json({ success: false, message: "Email already exists" });
  }
  try {
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(200).json({ success: true, message: "Created Account" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;

