const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Project = require("./Project");

const SchemaUser = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    projects: [{ id: mongoose.Schema.Types.ObjectId }],
    saved: [],
  },
  { timestamps: true }
);

SchemaUser.pre("remove", async function (next) {
  try {
    await Project.deleteMany({ userId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.models.User || mongoose.model("User", SchemaUser);
