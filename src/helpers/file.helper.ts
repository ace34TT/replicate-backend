import axios from "axios";
import fs from "fs";
import path from "path";
const tempDirectory = path.resolve(__dirname, "../tmp/");

export const generateRandomString = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
export const fetchImage = async (prefix: string, url: string) => {
  folderGuard();
  const response = await axios.get(url, { responseType: "stream" });
  if (response.status !== 200) {
    throw new Error(
      `Failed to fetch image: ${response.status} ${response.statusText}`
    );
  }
  const fileName = prefix + "_" + generateRandomString(10) + ".png";
  const filePath = path.resolve(tempDirectory, fileName);
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(filePath));
    writer.on("error", reject);
  });
};
export const deleteImage = async (filename: string) => {
  console.log("deleting : " + path.resolve(tempDirectory, filename));
  fs.unlinkSync(path.resolve(tempDirectory, filename));
};
export const folderGuard = () => {
  if (!fs.existsSync(tempDirectory)) {
    fs.mkdirSync(tempDirectory, { recursive: true });
  }
};
export const getFileName = (url: string) => {
  const parts = url.split("/");
  const fileName = parts[parts.length - 1];
  console.log(fileName);
  return fileName;
};
export const getFilePath = async (fileName: string) => {
  return path.resolve(tempDirectory, fileName);
};
