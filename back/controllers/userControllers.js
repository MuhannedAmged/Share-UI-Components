const User = require("../models/User");
const bcrypt = require("bcrypt");
const Project = require("../models/Project");
const jwt = require("jsonwebtoken");

exports.updateUser = async (req, res) => {
  try {
    const { token, name, email, image } = req.body;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (image) user.image = image;

    await user.save();
    res.json({ success: true, message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;

    await user.save();
    res.json({ success: true, message: "Password changed" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Password update failed" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    await Project.deleteMany({ userId: decoded.userId });
    const user = await User.findByIdAndDelete(decoded.userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    res.json({ success: true, message: "Account deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};
