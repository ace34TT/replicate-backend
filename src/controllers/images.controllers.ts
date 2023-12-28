import { Request, Response } from "express";
import { replicate } from "../configs/replicate.config";
import {
  convertDataToImage,
  deleteImage,
  fetchImage,
  getFilePath,
} from "../helpers/file.helper";
import fs from "fs";
import { uploadFileToFirebase } from "../services/firebase.service";
export const lucataco_sdxl_handler = async (req: Request, res: Response) => {
  try {
    console.log("processing");
    const [prompt, image] = [req.body.prompt, req.body.image];
    const output = await replicate.run(
      "lucataco/sdxl:c86579ac5193bf45422f1c8b92742135aa859b1850a8e4c531bff222fc75273d",
      {
        input: {
          prompt,
          image,
        },
      }
    );
    console.log(output);
    return res.status(200).json({ url: output });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const turf_visualizer_handler = async (req: Request, res: Response) => {
  try {
    console.log("processing");
    const [prompt, image] = [req.body.prompt, req.body.image];
    const filepath: string = (await fetchImage("turf", image)) as string;
    console.log(filepath);
    const data = fs.readFileSync(filepath);
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/maskformer-swin-base-coco",
      {
        headers: {
          Authorization: "Bearer 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",
        },
        method: "POST",
        body: data,
      }
    );
    const result = await response.json();
    const maskName = await convertDataToImage(result);
    const maskUrl = await uploadFileToFirebase(maskName);
    const output: any = await replicate.run(
      "subscriptions10x/sdxl-inpainting:733bba9bba10b10225a23aae8d62a6d9752f3e89471c2650ec61e50c8c69fb23",
      {
        input: {
          image,
          mask_image: maskUrl,
          prompt,
        },
      }
    );
    console.log(output[0]);
    deleteImage(filepath.split("/").pop()!);
    deleteImage(maskName);
    return res.status(200).json({ url: output[0] });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
