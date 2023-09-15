import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import { ReplicateRoutes } from "./routes/replicate.routes";
import cors from "cors";
const app = express();
// app.use((_req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );
//   next();
// });
app.use(cors());
app.use(bodyParser.json());
// !
app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "Hello world",
  });
});
app.use("/api", ReplicateRoutes);
app.use("/api/images", express.static(path.join(__dirname, "images")));

export { app };
