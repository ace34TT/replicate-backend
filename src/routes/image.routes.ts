import express from "express";
import {
  ai_packager_handler,
  generateImageSegmentation,
  generateImageVariation,
  lucataco_sdxl_handler,
  productVisualiserHandler,
  profileGeneratorHandler,
  turf_visualizer_handler,
} from "../controllers/images.controllers";
import upload from "../middlewares/multer.middleware";

const router = express.Router();

router.post("/lucataco_sdxl", lucataco_sdxl_handler);
router.post("/turf-visualizer", turf_visualizer_handler);
//
router.post("/ai-interior-design/segmentation", generateImageSegmentation);
router.post("/ai-interior-design/generate", generateImageVariation);
//
router.post("/ai-packager", ai_packager_handler);
router.post("/profile/generate", profileGeneratorHandler);
router.post("/ai-backdrop", productVisualiserHandler);
//

export { router as ImageRoutes };
