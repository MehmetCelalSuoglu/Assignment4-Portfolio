import express from "express";
import chatCtrl from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/api/suogluai/chat", chatCtrl.chat);

export default router;