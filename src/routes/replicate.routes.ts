import express from "express";
import {
  anyToImageHandler,
  imageToImageHandler,
  promptToMusicHandler,
  promptToVideoHandler,
  promptToVoiceHandler,
  realisticBackground,
} from "../controllers/replicate.controllers";
import upload from "../middlewares/multer.middleware";

const router = express.Router();

router.post("/video-generator/:model", promptToVideoHandler);
router.post("/image-generator/image2image", imageToImageHandler);
router.post(
  "/image-generator/any2image",
  upload.single("file"),
  anyToImageHandler
);
router.post("/music-generator", promptToMusicHandler);
router.post("/voice-generator", promptToVoiceHandler);
router.post("/realistic-background", realisticBackground);
export { router as ReplicateRoutes };