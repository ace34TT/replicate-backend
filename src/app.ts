import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import { ReplicateRoutes } from "./routes/replicate.routes";
import cors from "cors";
import { fetchImage } from "./helpers/file.helper";
import fs from "fs";
const app = express();

app.use(cors());
app.use(bodyParser.json());
// !
app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "Hello world",
  });
});
app.use("/api", ReplicateRoutes);
app.get("/download", async (req: Request, res: Response) => {
  try {
    console.log("downloading");
    const url: string = req.query.url as string;
    const filePath = (await fetchImage("img_", url)) as string;
    console.log(filePath);

    // Ensure the file is fully written before sending it
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`File doesn't exist`);
        return res.status(500).send("Error downloading file");
      }

      res.download(filePath, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error downloading file");
        } else {
          console.log("done");
          // deleteImage(filePath);
        }
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error fetching image");
  }
});
app.use("/api/images", express.static(path.join(__dirname, "images")));

export { app };
