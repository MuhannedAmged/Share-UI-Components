const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.post("/get", async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const projects = await Project.find({ userId: decoded.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, projects });
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized or invalid token" });
  }
});

router.post("/create", async (req, res) => {
  const { token, name, description, type, htmlCode, cssCode } = req.body;

  if (!token) {
    return res.status(401).json({ success: false, message: "Token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const project = new Project({
      userId: decoded.userId,
      name,
      description,
      type,
      htmlCode,
      cssCode,
    });

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (err) {
    console.error("Create project error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create project" });
  }
});

router.get("/random-projects", async (req, res) => {
  try {
    const count = await Project.countDocuments();

    if (count < 10) {
      const rawProjects = await Project.find().populate("userId", "name");

      // توحيد شكل البيانات ليطابق نتيجة aggregate
      const projects = rawProjects.map((p) => ({
        _id: p._id,
        name: p.name,
        description: p.description,
        htmlCode: p.htmlCode,
        cssCode: p.cssCode,
        user: {
          _id: p.userId._id,
          name: p.userId.name,
        },
      }));

      return res.status(200).json({ success: true, projects });
    } else {
      const projects = await Project.aggregate([
        { $sample: { size: 10 } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            htmlCode: 1,
            cssCode: 1,
            user: {
              _id: "$user._id",
              name: "$user.name",
            },
          },
        },
      ]);

      return res.status(200).json({ success: true, projects });
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/by-type/:type", async (req, res) => {
  const { type } = req.params;

  try {
    const projects = await Project.find({ type }).populate("userId", "name");

    const formatted = projects.map((p) => ({
      _id: p._id,
      name: p.name,
      description: p.description,
      htmlCode: p.htmlCode,
      cssCode: p.cssCode,
      type: p.type,
      user: {
        _id: p.userId._id,
        name: p.userId.name,
      },
    }));

    res.status(200).json({ success: true, projects: formatted });
  } catch (error) {
    console.error("Error fetching projects by type:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/delete", async (req, res) => {
  const { id, token } = req.body;

  if (!token || !id)
    return res
      .status(400)
      .json({ success: false, message: "Token and ID are required" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const project = await Project.findOneAndDelete({
      _id: id,
      userId: decoded.userId,
    });

    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found or unauthorized" });

    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, type, htmlCode, cssCode, token } = req.body;

  if (!token)
    return res.status(401).json({ success: false, message: "Token required" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const project = await Project.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      { name, description, type, htmlCode, cssCode },
      { new: true }
    );

    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found or unauthorized" });

    res
      .status(200)
      .json({ success: true, message: "Project updated", project });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/set-save-project", async (req, res) => {
  const { token, id } = req.body;

  if (!token || !id) {
    return res
      .status(400)
      .json({ success: false, message: "Token and project ID are required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.saved.includes(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Project already saved" });
    }

    user.saved.push(id);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Project saved successfully" });
  } catch (error) {
    console.error("Error saving project:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/get-save-project", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.saved.length === 0) {
      return res
        .status(200)
        .json({ success: true, projects: [], message: "No saved projects" });
    }

    const savedProjects = await Project.find({
      _id: { $in: user.saved },
    });

    res.status(200).json({
      success: true,
      projects: savedProjects.map((project) => ({
        _id: project._id,
        name: project.name,
        description: project.description,
        htmlCode: project.htmlCode,
        cssCode: project.cssCode,
        type: project.type,
      })),
    });
  } catch (error) {
    console.error("Error fetching saved projects:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/unsave-project", async (req, res) => {
  const { token, id } = req.body;

  if (!token || !id) {
    return res
      .status(400)
      .json({ success: false, message: "Token and project ID are required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.saved = user.saved.filter((projectId) => projectId.toString() !== id);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Project unsaved successfully" });
  } catch (error) {
    console.error("Error unsaving project:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { token } = req.body;

  try {
    const project = await Project.findById(id).populate("userId", "name");

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    let isSaved = false;

    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findById(decoded.userId);
      if (user) {
        project.views += 1;
        await project.save();
        if (user.saved.includes(id)) {
          isSaved = true;
        }
      }
    }

    res.status(200).json({
      success: true,
      project: {
        _id: project._id,
        name: project.name,
        description: project.description,
        htmlCode: project.htmlCode,
        cssCode: project.cssCode,
        type: project.type,
        views: project.views,
        isSaved,
        user: {
          _id: project.userId._id,
          name: project.userId.name,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
module.exports = router;
