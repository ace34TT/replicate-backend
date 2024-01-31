import { Request, Response } from "express";
import { replicate } from "../configs/replicate.config";
import {
  compressImage,
  convertDataToImage,
  deleteImage,
  fetchImage,
  getFilePath,
} from "../helpers/file.helper";
import fs from "fs";
import { uploadFileToFirebase } from "../services/firebase.service";
import { firebaseProcess } from "../services/turfVisualizer.service";
import sharp from "sharp";
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
    console.log("processing turf visualizer");
    const [image] = [req.file];
    if (!image) {
      console.log("Invalid data , image is required");
      return res.status(400).send("Invalid data , image is required");
    }
    let filepath = {
      filename: image.originalname,
      filepath: image.path,
    };
    if (image?.size > 1 * 1024 * 1024) {
      filepath = await compressImage(image.filename);
    }
    console.log(filepath);
    const data = fs.readFileSync(filepath.filepath);
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
    const imageUrl = await uploadFileToFirebase(image.filename);
    console.log(maskUrl);
    console.log(imageUrl);
    const promise_output_1: any = replicate.run(
      "subscriptions10x/sdxl-inpainting:733bba9bba10b10225a23aae8d62a6d9752f3e89471c2650ec61e50c8c69fb23",
      {
        input: {
          image: imageUrl,
          mask_image: maskUrl,
          prompt: "Clean green turf covering all the field",
          n_prompt: "Dirt, dust, sand, water, stones",
        },
      }
    );
    const promise_output_2: any = replicate.run(
      "subscriptions10x/sdxl-inpainting:733bba9bba10b10225a23aae8d62a6d9752f3e89471c2650ec61e50c8c69fb23",
      {
        input: {
          image: imageUrl,
          mask_image: maskUrl,
          prompt: "Clean green turf covering all the field",
          n_prompt: "Dirt, dust, sand, water, stones",
        },
      }
    );
    const [output_1, output_2] = await Promise.all([
      promise_output_1,
      promise_output_2,
    ]);
    console.log(output_1[0], output_2[0]);
    deleteImage(filepath.filepath.split("/").pop()!);
    deleteImage(maskName);
    firebaseProcess(output_1[0], output_2[0], req.body.userId);
    return res.status(200).json({ url: [output_1[0], output_2[0]] });
  } catch (error: any) {
    console.log("misy erreur teto");
    console.trace(error);
    return res.status(500).json({ message: error.message });
  }
};
