import Contact from "../models/contact.model.js";

const create = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    const savedContact = await contact.save();

    return res.status(201).json(savedContact);
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

const list = async (req, res) => {
  try {
    const contacts = await Contact.find();

    return res.status(200).json(contacts);
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

const contactByID = async (req, res, next, id) => {
  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        error: "Contact not found",
      });
    }

    req.contact = contact;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve contact",
    });
  }
};

const read = (req, res) => {
  return res.status(200).json(req.contact);
};

const update = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.contact._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json(contact);
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.contact._id);

    return res.status(200).json({
      message: "Contact deleted successfully",
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

const removeAll = async (req, res) => {
  try {
    await Contact.deleteMany({});

    return res.status(200).json({
      message: "All contacts deleted successfully",
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
  contactByID,
  read,
  update,
  remove,
  removeAll,
};