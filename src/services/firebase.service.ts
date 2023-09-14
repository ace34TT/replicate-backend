import * as admin from "firebase-admin";
import path from "path";
const tempDirectory = path.resolve(__dirname, "../tmp/");
import fs from "fs";
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "artpop-cdf4e",
    clientEmail: "firebase-adminsdk-gppxi@artpop-cdf4e.iam.gserviceaccount.com",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCnVcckeQ0hBx+9\n352hBx0JfGDuEs7m/WzcIwxZWI3mfjSG0+OQ6vwIWVi0VO8V/NKq+DAZ0ymgeiKv\nTHqaN6mK4V7PgHeFAJce9L9M/dryId7C+9yBsLdykkYeYToO1HUZ+j5hwLz7b4kQ\nAl2t3qZm5UGiKXtkOaKR/HB7hJ68jIHubsM6GheAK49y7CysqPdaq9seDRwKiC48\nzCMIjmNCMYr5PVTqBWAlufm3ciPw0p0cFM3Oe9/oytbcjvD4KrVfBIcZAL/ClvWa\nlgYJgmuRlVv831XtyQRzisc1NWDUEofhA/f+BQVqit2bDXLqWe1PJwbuI2xJmSKV\n/pGJFHEBAgMBAAECggEAAIAEEskuBeoYL4oGYreoLLUh5Z9wRCZZoWHIbmofLtZn\nNuG76+myQmsgvC85yxWT/DDpyEkstji1nez+VWby4bU3m/dwEMyi5vohXTjjL91a\njB4fd1LAhZeuA0OHayM6GcKfiTOMgDrbcvNy2+tod2VaS083U27mdbjs2oc+FMwP\np635xWIc9rxwXyRUDpTeIIyz+ypTNP7bRsnaOKqisBwk4DW6jiX371j1BZenOWIe\nAMfWsOtWPe+n0t7GSPPGysr1+f73Pb5tX6chg2D656op95x+ws+pC/0Z3oYE7yOi\nK4eKFHpkpI/mbXI4Qwup4ubhrrzOQIbN7Sk7OxCycQKBgQDhmrRng0t95+XUTqBq\n5g5FZzEw1jT0o5IAq4/+0u3UDHm73N1p24VW95S0PdK/B8b7l3j2eSi9dhodzp6o\nm8WAKYq9m3rmdfJ4sx4CFRb4XE1kAIdKQ7TSUchvBETPZ1i3HPEGfcKNXiT8pLv0\nORZfSkePyC4Oq+IoEZCU/natmQKBgQC94VCLvTuNcIhA4q2pc07vn+ofX/PmrDiu\nhX+TfHbbOZj6w3wAZIsJneo6wd+u2IWJuzEmy8djcn9dt93pKtchgus4U1AT2IvC\nqkodTNr4BMMfjvymBvzJsa0X6fpcil/flblkorzJzVaqEWEavivJ7ivBoRrUEIl8\nnwT4TDrvqQKBgQCHp42YvIL1Ny6kRY8CGEk2hEE422TGQWC2VHLmSBDHs6SzSLA+\nSchYrdBVvOLvCQ8mE0Oh+OJ9Yfl8ONSAEAJm+RO6xTXWQ8/Dsfh2ShYgyueiHQs8\npY+h85kw4AE8MSlQGe/39kC43oYhADEgPf9s1u5Gz5iaK9J2Q3GLlaLo6QKBgHCC\nvshec5gmkwXni0F56s8AMakvoQURDXET93k76e2SnnwQMzzEVsJ3COCSGmmvMMlg\n2woC+32IzcGJfnt4AAuCWMCCVVO9H2tUnh/od2M45yme/0OdplIY7tjZspj9ATwp\nqrXf2/+zpWOWcrR29NltQA422P/JYL4wN7Cs8sspAoGBANez10Esy22zXzpjfzPl\nogWeWEUBquWD4Mw3AinLfdjCuJVDWBFLj0jqjsCwYu7rhE4h2lCsJEvF5TAd0ziO\nF+af27/mTS0DpHs930H6E7kWiF+qYu5pYNAEK6f2bL3NVWIJlshQTjtHGzWWi9y2\nEuquuJvtOpfmjpNSuqv8L5EB\n-----END PRIVATE KEY-----\n",
  }),
  storageBucket: "gs://artpop-cdf4e.appspot.com",
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
