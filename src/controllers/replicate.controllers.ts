import { Request, Response } from "express";
import { replicate } from "../configs/replicate.config";
import { resizeImage } from "../helpers/image.helper";
import { deleteFile, uploadFileToFirebase } from "../services/firebase.service";
import { SDXLPayload } from "../models/input.model";
import { deleteImage, getFileName } from "../helpers/file.helper";

export const promptToVideoHandler = async (req: Request, res: Response) => {
  type Model = `${string}/${string}:${string}`;
  try {
    const userModel = req.params.model;
    let model: Model = `_/_:_`,
      data;
    switch (userModel) {
      case "deforum_stable_diffusion":
        console.log("deforum_stable_diffusion");
        model =
          "deforum/deforum_stable_diffusion:e22e77495f2fb83c34d5fae2ad8ab63c0a87b6b573b6208e1535b23b89ea66d6";
        data = {
          animation_prompts: req.body.prompt,
        };
        break;
      case "stable-diffusion-animation":
        model =
          "andreasjansson/stable-diffusion-animation:ca1f5e306e5721e19c473e0d094e6603f0456fe759c10715fcd6c1b79242d4a5";
        data = {
          prompt_start: req.body.start_prompt,
          prompt_end: req.body.end_prompt,
          output_format: "mp4",
        };
        console.log("stable-diffusion-animation", data);
        break;
      case "stable-diffusion-dance":
        console.log("stable-diffusion-dance");
        model =
          "pollinations/stable-diffusion-dance:dfb636aa9c04fe5b7d9897e6159ef88e3ecb3e1eb274c3f072dca7b495823280";
        data = {
          prompts: req.body.prompts,
        };
        break;
      case "i2vgen-xl":
        console.log("i2vgen-xl");
        console.log(req.body.file_url);
        model =
          "cjwbw/i2vgen-xl:92fc2f3e3db369db6065bcd3295dac2afbfd612a7cc4abcb45bd4707ccb55b7a";
        data = {
          task: "image-to-video",
          input_file: req.body.file_url,
          text: req.body.prompt,
          high_resolution: false,
        };
        break;
      default:
        break;
    }
    const output: any = await replicate.run(model, {
      input: { ...data },
    });
    console.log(output);
    return res.status(200).json({ url: output });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const imageToImageHandler = async (req: Request, res: Response) => {
  try {
    const [prompt, image, width, height] = [
      req.body.prompt,
      req.body.image,
      req.body.width,
      req.body.height,
    ];
    console.log("making image 2 image request");
    const output = await replicate.run(
      "stability-ai/sdxl:8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f",
      {
        input: {
          prompt: prompt,
          image: image,
          height: width,
          width: height,
          num_outputs: 2,
        },
      }
    );
    console.log(output);
    return res.status(200).json({ ...output });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const anyToImageHandler = async (req: Request, res: Response) => {
  console.log("calling any to image");
  const [prompt, image, width, height] = [
    req.body.prompt,
    req.file,
    req.body.width,
    req.body.height,
  ];
  try {
    const input: SDXLPayload = {
      prompt: prompt,
      width: Number(width),
      height: Number(height),
      num_outputs: 2,
    };
    let resizedFile;
    if (image) {
      resizedFile = await resizeImage(
        image.filename,
        Number(width),
        Number(height)
      );
      input.image = await uploadFileToFirebase(resizedFile!);
    }
    const output = await replicate.run(
      "stability-ai/sdxl:8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f",
      { input }
    );
    image && deleteImage(image?.filename);
    resizedFile && deleteImage(resizedFile);
    input.image && deleteFile(getFileName(input.image));
    console.log(output);
    console.log("job done");
    return res.status(200).json({ ...output });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const promptToMusicHandler = async (req: Request, res: Response) => {
  try {
    const [prompt] = [req.body.prompt];
    console.log("making music : " + prompt);
    const output = await replicate.run(
      "meta/musicgen:7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906",
      {
        input: {
          prompt: prompt,
          temperature: 1,
          model_version: "large",
          duration: 15,
          output_format: "mp3",
          normalization_strategy: "peak",
        },
      }
    );
    console.log(output);
    return res.status(200).json(output);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const promptToVoiceHandler = async (req: Request, res: Response) => {
  const [text, language, speaker_wav] = [
    req.body.text,
    req.body.language,
    req.body.speaker_wav,
  ];
  console.log({
    text: text,
    language: language,
    speaker_wav: speaker_wav,
  });
  try {
    const output = await replicate.run(
      "sigil-wen/xtts:408deaff0c9ba77846ce43a9b797fa9d08ce1a70830ad74c0774c55fd3aabce5",
      {
        input: {
          text: text,
          language: language,
          speaker_wav: speaker_wav,
        },
      }
    );
    console.log(output);
    return res.status(200).json(output);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const realisticBackground = async (req: Request, res: Response) => {
  try {
    const [prompt, image] = [req.body.prompt, req.body.image];
    console.log(prompt, image);
    const output = await replicate.run(
      "wolverinn/realistic-background:f77210f166f419c82faf53e313a8b18b24c2695d58116b4a77a900b2715f595a",
      {
        input: {
          prompt: prompt,
          image: image,
        },
      }
    );
    // console.log(output["image"]);
    return res.status(200).json({ ...output });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
