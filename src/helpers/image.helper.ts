import { folderGuard, generateRandomString } from "./file.helper";
import sharp from "sharp";
import path from "path";
import nodeHtmlToImage from "node-html-to-image";
const tempDirectory = path.resolve(__dirname, "../tmp/");
export const resizeImage = async (
  image: string,
  width: number,
  height: number
) => {
  try {
    folderGuard();
    const resizedFile = "resized _" + generateRandomString(10) + ".jpg";
    await sharp(path.resolve(tempDirectory, image))
      .resize(width, height, { fit: "cover" })
      .toFile(path.resolve(tempDirectory, resizedFile));
    return resizedFile;
  } catch (err) {
    console.error(err);
    // handle the error appropriately
  }
};
export const generateImageForPrintable = async (
  imageUrl: string,
  outputName: string
) => {
  const html = `
<html>
<head>
 <style>
    .image-container {
      position: relative;
      perspective: 400px;
      transform: scale(0.75);
      display: flex;
      justify-content: center;
      align-items: center;
      aspect-ratio: 1 / 1;
    }
    .image-object {
      object-fit: contain;
      width: auto;
      margin-left: auto;
      margin-right: auto;
      height: auto;
      margin-top: auto;
      margin-bottom: auto;
      transform: rotateX(0deg) rotateY(5deg);
      transform-style: preserve-3d;
      box-shadow: 0 10px 15px -3px rgba(119, 0, 176, 1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); 
      max-height: 100%;
    }
 </style>
</head>
<body>
 <div class="image-container">
    <img class="image-object" src="${imageUrl}" alt="Transformed Image">
 </div>
</body>
</html>
`;
  await nodeHtmlToImage({
    output: path.resolve(tempDirectory, outputName),
    html: html,
    transparent: true,
    type: "png",
  });
};
