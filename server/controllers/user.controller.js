import User from "../models/user.model.js";
import errorHandler from "./error.controller.js";

const create = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: "user",
    });

    await user.save();

    return res.status(201).json({
      message: "Successfully signed up!",
    });

  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const list = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email role updated created");

    return res.json(users);

  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    req.profile = user;
    next();

  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user",
    });
  }
};

const read = (req, res) => {
  const user = req.profile.toObject();

  delete user.hashed_password;
  delete user.salt;

  return res.json(user);
};

const update = async (req, res) => {
  try {
    const user = req.profile;

    // Only allow these fields to be updated.
    if (req.body.name !== undefined) {
      user.name = req.body.name;
    }

    if (req.body.email !== undefined) {
      user.email = req.body.email;
    }

    user.updated = Date.now();

    await user.save();

    const updatedUser = user.toObject();

    delete updatedUser.hashed_password;
    delete updatedUser.salt;

    return res.json(updatedUser);

  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    const user = req.profile;

    const deletedUser = await user.deleteOne();

    return res.json({
      message: "User successfully deleted",
      deletedUser: deletedUser,
    });

  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update,
};