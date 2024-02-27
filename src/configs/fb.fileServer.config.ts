import * as admin from "firebase-admin";
require("dotenv").config();

const { privateKey } = JSON.parse(process.env.FIREBASE_PRIVATE_KEY || "");

const fb_fileServerInstance = admin.initializeApp(
  {
    credential: admin.credential.cert({
      projectId: "",
      clientEmail: "",
      privateKey,
    }),
    storageBucket: process.env.FIREBSE_STORAGE_BACKET,
  },
  "file-server"
);

export { fb_fileServerInstance };
