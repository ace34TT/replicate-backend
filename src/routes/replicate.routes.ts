import express from "express";
import { replicateHandler } from "../controllers/replicate.controllers";

const router = express.Router();

router.post("/:model", replicateHandler);
export { router as ReplicateRoutes };
