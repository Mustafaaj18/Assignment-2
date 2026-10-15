import Qualification from "../models/qualification.model.js";

const create = async (req, res) => {
  try {
    const qualification = new Qualification(req.body);
    const savedQualification = await qualification.save();

    return res.status(201).json(savedQualification);
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

const list = async (req, res) => {
  try {
    const qualifications = await Qualification.find();

    return res.status(200).json(qualifications);
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

const qualificationByID = async (req, res, next, id) => {
  try {
    const qualification = await Qualification.findById(id);

    if (!qualification) {
      return res.status(404).json({
        error: "Qualification not found",
      });
    }

    req.qualification = qualification;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve qualification",
    });
  }
};

const read = (req, res) => {
  return res.status(200).json(req.qualification);
};

const update = async (req, res) => {
  try {
    const qualification = await Qualification.findByIdAndUpdate(
      req.qualification._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json(qualification);
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    await Qualification.findByIdAndDelete(req.qualification._id);

    return res.status(200).json({
      message: "Qualification deleted successfully",
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

const removeAll = async (req, res) => {
  try {
    await Qualification.deleteMany({});

    return res.status(200).json({
      message: "All qualifications deleted successfully",
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
  qualificationByID,
  read,
  update,
  remove,
  removeAll,
};