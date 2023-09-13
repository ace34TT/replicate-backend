import express from "express";
import {
  imageToImageHandler,
  replicateHandler,
} from "../controllers/replicate.controllers";

const router = express.Router();

router.post("/video-generator/:model", replicateHandler);
router.post("/image-generator/image2image", imageToImageHandler);
export { router as ReplicateRoutes };
