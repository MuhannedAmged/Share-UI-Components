const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.post("/update", async (req, res) => {
  const { token, name, email, image } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.image = image || user.image;

    await user.save();

    res.json({ success: true, message: "Profile updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});
module.exports = router;
