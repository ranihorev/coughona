import * as AWS from "aws-sdk";
import { ManagedUpload, Metadata } from "aws-sdk/clients/s3";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1"
});

const bucketName = "coughona";

export const uploadFile = async (
  key: string,
  fileStream: Buffer,
  meta?: Metadata
) => {
  console.log(key);
  var s3 = new AWS.S3();
  return new Promise<ManagedUpload.SendData>((resolve, reject) => {
    s3.upload(
      {
        Bucket: bucketName,
        Key: key,
        Body: fileStream,
        ...(meta !== undefined && { Metadata: meta })
      },
      (err: Error, result: ManagedUpload.SendData) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        resolve(result);
      }
    );
  });
};
