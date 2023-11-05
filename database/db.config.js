import AWS from "aws-sdk";

const credentials = new AWS.Credentials({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

AWS.config.update({
  region: "us-east-1",
  credentials,
});

const db = new AWS.DynamoDB.DocumentClient();

const Table = "Users";

export { db, Table };
