import express from "express";
import { videoDescription } from "../controllers/video.controller";

const router = express.Router();

router.post("/video-llama", videoDescription);

export { router as VideoRoutes };
