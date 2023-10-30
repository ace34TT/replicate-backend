import express from "express";
import {
  anyToImageHandler,
  image2videoHandler,
  imageToImageHandler,
  promptToMusicHandler,
  promptToVideoHandler,
  promptToVoiceHandler,
  realEsrganHandler,
  realisticBackgroundHandler,
  removeBackgroundHandler,
  upscaleHandler,
  video2VideoHandler,
} from "../controllers/replicate.controllers";
import upload from "../middlewares/multer.middleware";

const router = express.Router();

router.post("/video-generator/image2video", image2videoHandler);
router.post("/video-generator/video2video", video2VideoHandler);
router.post("/video-generator/:model", promptToVideoHandler);
//
router.post("/image-generator/image2image", imageToImageHandler);
router.post(
  "/image-generator/any2image",
  upload.single("file"),
  anyToImageHandler
);
router.post("/music-generator", promptToMusicHandler);
router.post("/voice-generator", promptToVoiceHandler);
router.post("/realistic-background", realisticBackgroundHandler);
router.post("/remove-background", removeBackgroundHandler);
router.post("/upscale", upscaleHandler);
router.post("/real-esrgan", realEsrganHandler);
export { router as ReplicateRoutes };
