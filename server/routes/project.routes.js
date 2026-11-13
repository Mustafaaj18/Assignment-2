import express from "express";
import projectCtrl from "../controllers/project.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

// Anyone can view projects.
// Only Admin can create or delete all projects.
router.route("/api/projects")
  .get(projectCtrl.list)
  .post(authCtrl.requireSignin, authCtrl.isAdmin, projectCtrl.create)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, projectCtrl.removeAll);

router.param("projectId", projectCtrl.projectByID);

// Anyone can view individual projects.
// Only Admin can update or delete them.
router.route("/api/projects/:projectId")
  .get(projectCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.isAdmin, projectCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, projectCtrl.remove);

export default router;