import express from "express";
import {
  createRvcDataSetHandler,
  trainRvcModelHandler,
  voiceCloningHandler,
} from "../controllers/voices.controller";
import upload from "../middlewares/multer.middleware";

const router = express.Router();

router.get("/create-dataset", createRvcDataSetHandler);
router.get("/train-model", trainRvcModelHandler);
router.post("/voice-cloning", upload.single("speech"), voiceCloningHandler);

export { router as VoicesRoutes };
