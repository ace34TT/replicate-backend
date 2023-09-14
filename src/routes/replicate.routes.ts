import express from "express";
import {
  anyToImageHandler,
  imageToImageHandler,
  replicateHandler,
} from "../controllers/replicate.controllers";
import upload from "../middlewares/multer.middleware";

const router = express.Router();

router.post("/video-generator/:model", replicateHandler);
router.post("/image-generator/image2image", imageToImageHandler);
router.post(
  "/image-generator/any2image",
  upload.single("file"),
  anyToImageHandler
);
export { router as ReplicateRoutes };
