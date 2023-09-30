import * as admin from "firebase-admin";
import path from "path";
const tempDirectory = path.resolve(__dirname, "../tmp/");
import fs from "fs";
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "artpop-9f596",
    clientEmail: "firebase-adminsdk-173x0@artpop-9f596.iam.gserviceaccount.com",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCv1VhV/PEI3xB+\nFUpt/bXo+T1txok+sEsgKe67LLzXHa+q9InbDrT0A2MXcqq+1V4w66CHdqDKTdoG\nJ1Kj5sqYUN9i7TJGIw91GijYJfP9UPfB7wMtAjaTSo+7BFADM/XxULbVZDLfxarI\nRTAVY7p60Vc5ZZFa4bR40XGrbQvAYKTWfZngRXBtUaZ8qZaCw4I2P4Hz1u6DPJOF\nKzSAMv4yPgkNA91VWEPSNugmko+l5rRgcZbZneOZfn+10Pg39EOLLdNToyHWCRmx\nArO+suBNH/Wr4lrHGtkEr/ZP936thvs7jdpMMk1YniCtldKwG5lpWGgqh6+q6kAx\nI4BsoeoTAgMBAAECggEAAMN29VI5ExTbeM4GCREQzsEGXDGHOiDEotUXp0qEzWiB\noWgAFWZB3nYD8w98213rlEykejybX9j17xd0hn5gg9yw1jh22WhKoes3xPNlipiH\nayb7erb62QMd06Reb95T9BrD18vcSNhQSXVTJ3z3xNMCsuIy06ad+krC+C/XLkLA\nfj00nfk/anU9Z0bMPNXASDezU2gHuo6X+FaiDkUFDMlGTAU6BTUfDVHFeB+hXjDT\n+8lajIWadgkPQ/7uAesDr/1PxfH/lYEc4S8UZ4j8xJxr5X34/L+mjC9rirYKgM26\nB5tzbtv5EjhhghBi3wjj/fGhRvsCKl67WVBZTGnhJQKBgQDYaO0+1gN24+LxdQUy\n5RFZHvHUqGk/bb2ZUr1pVVf8TZGtEod5LxAVG+A0zwA4u7BCShkuO1aX3Qpbzqgt\ni8J0A5BTeWOBiwjkoD1ZVqQLVYDevXowhqGLa6cTaD2vVguCXTAQhu88khlHLXhi\n3toNCS7YRn+0WMIn+HERkVnsHQKBgQDQABvi97YRbA6TLOxSOeO+TfvbJLU9wPtX\nuXjbie/g9pv+7HzeAFqgdlRYxnhqN8ojtWmjdRiHlNwNmK8UDPHHpJ/MHMT1+G/2\naQlB8VeBU6jxrrWs+LbpjAZtqV6PLs4uvfnJGsjgRIdFNgB6K6XjJIl/ybxJuaE4\nnhEnCxF37wKBgCffdU7tiaffJxJL+FA/Smn8PJxtBy9LnfJg/0soEVUISb30uwdF\n95WcFDxGo4jQdBJSqr8M6dCDRoRR2ETECmjruyzWIdJddp8BMyyBvSnlcCAaEyhb\nteoFRLxbqXnjxa0YVGHHKs8jMAsgQp0c6FochggNPTxSWjuZF+Qfvsy1AoGBAKKf\nIy5t64xthmutGMsk9ZlpUTtB1O4GPryUhxhmHQUu6kICVZIghrqkKUgLTEQHgGQw\nxvoEZ/xA91cuA9xSTop/fGxSJfAFoEvwTUugTIERjqn+pY4qGqA4WSJN5F9gAdXr\ntCp2ZY1qJrSHBxJ9o8IWY+ZkLHEb0B/6/YAgGDVDAoGAPlV4BYbhJKAlgAfmhyFL\ng6fkXLnba4Rpyevj4TXq+LInHdRamVEAQIiH9PhSW3BRRnwf501BkAdRiH+GI2YJ\noRnUBdL/8e7a2+N7bv2tm/hNYg0X4GyLLBilh9KIWPKH68iXj4ScSU/nOupbaW3s\nJeJ2t0FzYPeE+7XaJLPREEY=\n-----END PRIVATE KEY-----\n",
  }),
  storageBucket: "gs://artpop-9f596.appspot.com",
});
export const uploadFileToFirebase = async (filename: string) => {
  const bucket = admin.storage().bucket();
  await bucket.upload(path.resolve(tempDirectory + "/" + filename), {
    destination: "images/" + filename,
  });
  const fileRef = bucket.file("images/" + filename);
  await fileRef.makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;
  return publicUrl;
};
export const deleteFile = async (filename: string) => {
  try {
    const bucket = admin.storage().bucket();
    const file = bucket.file("images/" + filename);
    await file.delete();
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};