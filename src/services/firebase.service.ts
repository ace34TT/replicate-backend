import * as admin from "firebase-admin";
import path from "path";
const tempDirectory = path.resolve(__dirname, "../tmp/");
import fs from "fs";
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "file-server-f5b74",
    clientEmail:
      "firebase-adminsdk-c9in6@file-server-f5b74.iam.gserviceaccount.com",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC02SefVi0rPg26\nb8O0j4blZzR3O3m0wS4MjANLMexQxgCoi+c8NCk6jX1tJfIq46zxQo4WJk/FXxzu\n7ySmLiJqKO3jK7A49IlW4tQhMNzOqv2DrTeeCwJL2t1B9LcA7sophtffZCpPLKsu\nOSuzpCmUn5jyEQDRfz9f4EJOGr56xqBeJkXrUV9/Q3VL8qa8cQnqfSBYTynLLgfM\nwDg7NXrFvZ1vMJbUdOow9nNOKa3ntT8TrxotaLu8FfEBUDCIGJHeNnWM0rjaZEMB\n2115eU6uWyhRXpv7OSgO6/V72yCqWmofg5ffiLyM8IDCyNHPzUN+vaeexsKbdL7+\nWdjkbtRbAgMBAAECggEATMrTCNUqe+yvHqX7t62kbb/bpu+B2A+ZkqlXcrQhsRDK\n0ccKauWJRjwzcMgGo1CnLJECzYP6JoijPBAfA1OeuG5lyStRenXX5aWOxwM9F6LC\n4ImKjtkE4hnvDuUvWj2LaYPBIbIiRxlkHM4Y8QB5yYrVgqBWtR6v1fHfpdO0Y2RC\nK0l+N0JoD17bHRw8nW4nU8w5CyG6gJr94ME7DLux6jBI28+q1cGzduMOlQUgaQWg\nIPQE+bgBwOq/SP78w9+6IjBnQOCyUG8yofTHkjaZ6HqWGD9eIox1LAWto/3UdZqW\n1tf2YC3sTvXPGjvC1kCMukk42ymM7DuNJI2M41K53QKBgQDmC6JmYuo8ylYz9LUN\n3Jsu2Ogf9VkAcJ2GQXhJhuuuN4q+R3fhDhrGaNnvKoqsYUnhhod4PVvBMl3gecMj\nBXQLtPRY/kyJ7Klkwt3/3X7NVPtjGweytDmBviLI4YCIOoHP1urAhr2R+CgG7cxt\n71iP6ZN+8bPjiRx1Do6FarsxnwKBgQDJQJDlBb2qOOULi04MQPn6h8g5YIC8sb7Q\nocbRnw3keXY92v/78BV+SFpI1MgzXEJV6lKuTvWDAkK/+Ee07+R45Y1BeaNIgXzI\nOMRq8Y/Nd5kfQpti9xRn2A6P8+iMfgo/Jv1UzeRhpz1/le+SBkLS19PBCyQZx0Lf\nzMjvUM47xQKBgC1vftPaFYmMLRp16oyiVcQa8z3cp4d+tp4dsDRVgZcXQT/zvaml\nr4QgkWq7bEg/rufsOjV1aPnviLsdUX1JRnJJezlYgKV9KLfOBSrUBIdpkX0xiYOy\nNOl7NEOYxlohtCHowNTlx+tcqAs2THoqG8PQzmD0PCNkoUo9ZcjUG8ThAoGACUSJ\n56IOC+q20YNGwtWzLVBXbhz9kLL2wJDSoRCcCSt2wH53T1jNBJW8YqI53fOfsmkq\nCZDlSXUvMbvzQWfSs6aOjLdXR51+65GBqhMZtjKNwJzGnxYVwHp4oTRwPxgGzMW0\n4NTicYTMFjYHZEgZh7ActkUXEoDUmY3KqwqjlKkCgYEAlT0SvVeaC1OPJ1oBOWz5\nsYupHMgnv6kv5DLt6sxERVxXNR2VrJBb9SWrYRt2EdaMBmGu0BNcRDU2yUMc1C4+\nrYjgQuARwozR/iaU82DAXyr19BxJ2dSrwu5f38udkGYKFrU8qncw/JgooHh9WN1M\nYSn2nDF5/tOfM4hsLm4qm+w=\n-----END PRIVATE KEY-----\n",
  }),
  storageBucket: "gs://file-server-f5b74.appspot.com",
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
export const saveFileFromFirebase = async (filename: string) => {
  if (!fs.existsSync(tempDirectory)) {
    fs.mkdirSync(tempDirectory, { recursive: true });
  }
  const bucket = admin.storage().bucket();
  const file = bucket.file("images/" + filename);
  const destination = path.resolve(tempDirectory + "/" + filename);
  await file.download({ destination });
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
