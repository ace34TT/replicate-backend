import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fb_fileServerInstance as admin } from "./../configs/fb.fileServer.config";

const tempDirectory = path.resolve(__dirname, "../tmp/");

export const uploadFileToFirebase = async (
  filename: string,
  folder: string = "files",
  firebaseInstance = admin
) => {
  const bucket = firebaseInstance.storage().bucket();
  const inputPath = path.resolve(tempDirectory, filename);
  const outputPath = path.resolve(tempDirectory, `watermarked_${filename}`);

  try {
    // Add watermark to the image
    await sharp(inputPath)
      .composite([
        {
          input: {
            text: {
              text: "Luxxio",
              font: "Arial",
              fontSize: 48,
              rgba: true,
            },
          },
          gravity: "southeast",
        },
      ])
      .toFile(outputPath);

    // Upload the watermarked image
    await bucket.upload(outputPath, {
      destination: folder + "/" + filename,
    });

    // Delete the temporary watermarked file
    fs.unlinkSync(outputPath);

  } catch (error) {
    console.log(error);
    throw error;
  }

  const fileRef = bucket.file(folder + "/" + filename);
  await fileRef.makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;
  return publicUrl;
};

export const saveFileFromFirebase = async (
  filename: string,
  folder: string = "files",
  firebaseInstance = admin
) => {
  if (!fs.existsSync(tempDirectory)) {
    fs.mkdirSync(tempDirectory, { recursive: true });
  }
  const bucket = firebaseInstance.storage().bucket();
  const file = bucket.file(folder + filename);
  const destination = path.resolve(tempDirectory + "/" + filename);
  await file.download({ destination });
};
export const deleteFile = async (
  filename: string,
  folder: string = "files"
) => {
  try {
    const bucket = admin.storage().bucket();
    const file = bucket.file(folder + filename);
    await file.delete();
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};
export const getDocument = async (
  collectionName: any,
  documentId: any,
  firebaseInstance: any
) => {
  const firestore = firebaseInstance.firestore();
  const docRef = firestore.collection(collectionName).doc(documentId);
  // Get the document
  const doc = await docRef.get();

  if (doc.exists) {
    return {
      ...doc.data(),
    };
  } else {
    return {};
  }
};
export const updateDocument = async (
  collectionName: any,
  documentId: any,
  data: any,
  firebaseInstance: any
) => {
  const firestore = firebaseInstance.firestore();
  const docRef = firestore.collection(collectionName).doc(documentId);
  // Update the document
  await docRef.update(data);
};
