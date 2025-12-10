// server/controllers/project.controller.js
import Project from "../models/project.js";
import errorHandler from "./error.controller.js";

// Create a new project
const create = async (req, res) => {
  try {
    const project = new Project({
      name: req.body.name,
      description: req.body.description || "",
      link: req.body.link || "",
      // Uploaded file path: uploads/filename.jpg
      imageUrl: req.file ? `uploads/${req.file.filename}` : "",
    });

    await project.save();
    return res
      .status(200)
      .json({ message: "Project created successfully!", project });
  } catch (err) {
    console.error("❌ Project create error:", err);
    return res
      .status(400)
      .json({ error: errorHandler.getErrorMessage(err) });
  }
};

// List all projects
const list = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    return res
      .status(400)
      .json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Get project by ID
const projectByID = async (req, res, next, id) => {
  try {
    const project = await Project.findById(id);
    if (!project) return res.status(400).json({ error: "Project not found" });
    req.project = project;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve project" });
  }
};

// Read single project
const read = (req, res) => {
  return res.json(req.project);
};

// Update project
const update = async (req, res) => {
  try {
    const project = req.project;

    // text alanları
    project.name = req.body.name || project.name;
    project.description =
      typeof req.body.description !== "undefined"
        ? req.body.description
        : project.description;
    project.link =
      typeof req.body.link !== "undefined" ? req.body.link : project.link;

    // Yeni resim geldiyse
    if (req.file) {
      project.imageUrl = `uploads/${req.file.filename}`;
    }

    await project.save();
    res.json(project);
  } catch (err) {
    console.error("❌ Project update error:", err);
    return res
      .status(400)
      .json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Delete project
const remove = async (req, res) => {
  try {
    const deletedProject = await req.project.deleteOne();
    res.json(deletedProject);
  } catch (err) {
    console.error("❌ Project delete error:", err);
    return res
      .status(400)
      .json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default { create, list, read, update, remove, projectByID };
