import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import { replicate } from "./configs/replicate.config";
import { ReplicateRoutes } from "./routes/replicate.routes";

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
app.use("/api", ReplicateRoutes);
// app.use("/api/image-generator", ReplicateRoutes);
// app.post("/api/generate", async (req, res) => {
//   try {
//     const output: any = await replicate.run(
//       "cjwbw/i2vgen-xl:92fc2f3e3db369db6065bcd3295dac2afbfd612a7cc4abcb45bd4707ccb55b7a",
//       {
//         input: {
//           task: "image-to-video",
//           input_file: req.body.file_url,
//           text: req.body.prompt,
//           high_resolution: false,
//         },
//       }
//     );
//     console.log(output);
//     return res.status(200).json({ url: output });
//   } catch (error: any) {
//     console.log(error);
//     return res.status(500).json({ message: error.message });
//   }
// });
app.use("/api/images", express.static(path.join(__dirname, "images")));

export { app };
