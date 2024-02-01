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
import lodash from "lodash";
import {
  getDocument,
  uploadFileToFirebase,
} from "../services/firebase.service";
import { firebaseProcess } from "../services/turfVisualizer.service";
import sharp from "sharp";
import { fb_tufVisualizerInstance } from "../configs/fb.turfVisualizer.config";
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

    const prompts = await getDocument(
      "prompts",
      "FHR3HO03svsLcrpHCfWv",
      fb_tufVisualizerInstance
    );
    console.log(prompts);
    const promise_output_1: any = replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          image: imageUrl,
          mask: maskUrl,
          // prompt: prompts.prompt || "Clean green turf covering all the field",
          prompt: "beautiful fake grass",
          // negative_prompt:
          //   prompts.negative_prompt || "Dirt, dust, sand, water, stones",\
          negative_prompt: "",
          width: 1024,
          height: 1024,
          scheduler: "K_EULER",
          num_inference_steps: 20,
          guidance_scale: 7.5,
          prompt_strength: 0.8,
          // seed: lodash.sample([18668, 59732, 59733, 30418]),
          seed: 41181,
          refine: "no_refiner",
          high_noise_frac: 0.8,
          lora_scale: 0.6,
        },
      }
    );
    const promise_output_2: any = replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          image: imageUrl,
          mask: maskUrl,
          prompt: "beautiful fake grass",
          negative_prompt: "",
          width: 1024,
          height: 1024,
          num_inference_steps: 20,
          scheduler: "K_EULER",
          guidance_scale: 7.5,
          prompt_strength: 0.8,
          // seed: lodash.sample([12480, 12481, 41181]),
          seed: 41181,
          refine: "no_refiner",
          high_noise_frac: 0.8,
          lora_scale: 0.6,
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
