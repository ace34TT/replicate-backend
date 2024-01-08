import { firebaseTufVisualizerInstance } from "../configs/fb.turfVisualizer.config";
import { deleteImage, fetchImage, getFileName } from "../helpers/file.helper";

import path from "path";
const tempDirectory = path.resolve(__dirname, "../tmp/");

export const firebaseProcess = async (
  image1: string,
  image2: string,
  userId: string
) => {
  console.log("processing firebase ");
  const p_filename_1 = fetchImage("turf_", image1);
  const p_filename_2 = fetchImage("turf_", image2);
  const [file_1, file_2] = await Promise.all([p_filename_1, p_filename_2]);
  const p1_fileUpload = uploadFileToFirebase(getFileName(file_1 as string));
  const p2_fileUpload = uploadFileToFirebase(getFileName(file_2 as string));
  const [output_1, output_2] = await Promise.all([
    p1_fileUpload,
    p2_fileUpload,
  ]);
  deleteImage(getFileName(file_1 as string));
  deleteImage(getFileName(file_2 as string));
  insertData({ userId, images: [output_1, output_2] });
  console.log("process done ");
};
const uploadFileToFirebase = async (filename: string) => {
  const bucket = firebaseTufVisualizerInstance.storage().bucket();
  await bucket.upload(path.resolve(tempDirectory + "/" + filename), {
    destination: filename,
  });
  const fileRef = bucket.file(filename);
  await fileRef.makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;
  return publicUrl;
};
const insertData = async (data: any) => {
  console.log(data);
  const db = firebaseTufVisualizerInstance.firestore();
  const docRef = db.collection("images").doc();
  await docRef.set(data);
};
