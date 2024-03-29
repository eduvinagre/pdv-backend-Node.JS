const aws = require("aws-sdk");
const endpoint = new aws.Endpoint(process.env.ENDPOINT_S3);

const s3 = new aws.S3({
  endpoint,
  credentials: {
    accessKeyId: process.env.KEY_ID,
    secretAccessKey: process.env.APP_KEY,
  },
});

const uploadImage = async (path, buffer, mimetype) => {
  const image = await s3
    .upload({
      Bucket: process.env.BACKBLAZE_BUCKET,
      Key: path,
      Body: buffer,
      ContentType: mimetype,
    })
    .promise();

  return {
    path: image.Key,
    url: `https://${process.env.BACKBLAZE_BUCKET}.${process.env.ENDPOINT_S3}/${image.Key}`,
  };
};

const deleteFile = async (produto_imagem) => {
  await s3
    .deleteObject({
      Bucket: process.env.BACKBLAZE_BUCKET,
      Key: produto_imagem,
    })
    .promise();
};

module.exports = { uploadImage, deleteFile };
