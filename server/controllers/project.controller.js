import Project from "../models/project.model.js";

const create = async (req, res) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();

    return res.status(201).json(savedProject);
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

const list = async (req, res) => {
  try {
    const projects = await Project.find();

    return res.status(200).json(projects);
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

const projectByID = async (req, res, next, id) => {
  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    req.project = project;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve project",
    });
  }
};

const read = (req, res) => {
  return res.status(200).json(req.project);
};

const update = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.project._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json(project);
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.project._id);

    return res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

const removeAll = async (req, res) => {
  try {
    await Project.deleteMany({});

    return res.status(200).json({
      message: "All projects deleted successfully",
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

export default {
  create,
  list,
  projectByID,
  read,
  update,
  remove,
  removeAll,
};