import axios from "axios";
import fs from "fs";
import path from "path";
const tempDirectory = path.resolve(__dirname, "../tmp/");
import ffmpeg from "fluent-ffmpeg";
import { deleteImage, generateRandomString } from "./file.helper";
import { uploadFileToFirebase } from "../services/firebase.service";
export const mp3ToWave = async (file: string) => {
  const track = path.resolve(tempDirectory, file); // your path to source file
  const outputName = generateRandomString(10) + ".wav";
  await convertToWav(track, outputName);
  const url = await uploadFileToFirebase(outputName);
  console.log(url);
  deleteImage(outputName);
  deleteImage(file);
  return url;
};

async function convertToWav(track: any, outputName: any) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(track)
      .toFormat("wav")
      .on("error", (err) => {
        console.log("An error occurred: " + err.message);
        reject(err);
      })
      .on("progress", (progress) => {
        console.log("Processing: " + progress.targetSize + " KB converted");
      })
      .on("end", () => {
        console.log("Processing finished !");
        resolve();
      })
      .save(path.resolve(tempDirectory, outputName));
  });
}
