const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  updateUser,
  changePassword,
  deleteUser,
} = require("../controllers/userControllers");

router.post("/update", updateUser);

router.post("/change-password", changePassword);

router.post("/delete", deleteUser);

router.post("/profile", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId).select("name email image");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({
      success: true,
      name: user.name,
      email: user.email,
      image: user.image || "",
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
