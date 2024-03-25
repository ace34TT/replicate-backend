import express from "express";
import {
  generateImageSegmentation,
  generateImageVariation,
  lucataco_sdxl_handler,
  turf_visualizer_handler,
} from "../controllers/images.controllers";
import upload from "../middlewares/multer.middleware";

const router = express.Router();

router.post("/lucataco_sdxl", lucataco_sdxl_handler);
router.post("/turf-visualizer", turf_visualizer_handler);
//
router.post("/ai-interior-design/segmentation", generateImageSegmentation);
router.post("/ai-interior-design/generate", generateImageVariation);
export { router as ImageRoutes };
