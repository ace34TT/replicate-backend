import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import { replicate } from "./configs/replicate.config";

const app = express();
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use(bodyParser.json());

// !
app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "Hello world",
  });
});
app.post("/api/generate", async (req, res) => {
  const output: any = await replicate.run(
    "stability-ai/sdxl:d830ba5dabf8090ec0db6c10fc862c6eb1c929e1a194a5411852d25fd954ac82",
    {
      input: {
        negative_prompt: "letter , words , number , text",
        width: 512,
        height: 512,
        prompt: req.body.prompt,
        num_inference_steps: 30,
        scheduler: "K_EULER",
      },
    }
  );
  return res.status(200).json({ url: output[0] });
});
app.use("/api/images", express.static(path.join(__dirname, "images")));

export { app };
