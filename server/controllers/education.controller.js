import Education from "../models/education.js"; // or qualifications.model.js
import errorHandler from "./error.controller.js";

// Create
const create = async (req, res) => {
  try {
    console.log("📩 Incoming education body:", req.body);

    const edu = new Education({
      institution: req.body.institution,
      program: req.body.program,
      years: req.body.years,
      description: req.body.description,
    });

    await edu.save();

    return res
      .status(200)
      .json({ message: "Education created successfully!", edu });
  } catch (err) {
    console.error("❌ Education create error:", err);
    return res
      .status(400)
      .json({ error: errorHandler.getErrorMessage(err) });
  }
};


// List all
const list = async (req, res) => {
  try {
    const eduList = await Education.find();
    res.json(eduList);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// By ID
const educationByID = async (req, res, next, id) => {
  try {
    const edu = await Education.findById(id);
    if (!edu) return res.status(400).json({ error: "Education not found" });
    req.education = edu;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve education" });
  }
};

// Read
const read = (req, res) => res.json(req.education);

// Update
const update = async (req, res) => {
  let edu = req.education;
  edu = Object.assign(edu, req.body);
  try {
    await edu.save();
    res.json(edu);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Delete
const remove = async (req, res) => {
  try {
    const deleted = await req.education.deleteOne();
    res.json(deleted);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default { create, list, read, update, remove, educationByID };