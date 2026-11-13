import express from "express";
import contactCtrl from "../controllers/contact.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

// Anyone can submit the contact form.
// Only Admin can view or delete all submissions.
router.route("/api/contacts")
  .get(authCtrl.requireSignin, authCtrl.isAdmin, contactCtrl.list)
  .post(contactCtrl.create)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, contactCtrl.removeAll);

router.param("contactId", contactCtrl.contactByID);

// Only Admin can view, update or delete individual submissions.
router.route("/api/contacts/:contactId")
  .get(authCtrl.requireSignin, authCtrl.isAdmin, contactCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.isAdmin, contactCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, contactCtrl.remove);

export default router;