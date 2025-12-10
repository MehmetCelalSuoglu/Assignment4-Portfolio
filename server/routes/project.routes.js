import express from "express";
import projectCtrl from "../controllers/project.controller.js";
import authCtrl from "../controllers/auth.controller.js";
import upload from "../uploads/uploads.js";

const router = express.Router();

// CRUD routes
router
  .route("/api/projects")
  .post(
    authCtrl.requireSignin,
    authCtrl.isAdmin,
    upload.single("image"),   // ← dosya alanı "image"
    projectCtrl.create
  )
  .get(projectCtrl.list);

router
  .route("/api/projects/:projectId")
  .get(projectCtrl.read)
  .put(
    authCtrl.requireSignin,
    authCtrl.isAdmin,
    upload.single("image"),
    projectCtrl.update
  )
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, projectCtrl.remove);

// Middleware to handle :projectId
router.param("projectId", projectCtrl.projectByID);

export default router;
