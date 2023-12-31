require('dotenv').config()
const { S3Client, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand, AbortMultipartUploadCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    endpoint: process.env.ENDPOINT_S3,
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.APP_KEY,
    }
})

async function uploadFile(originalname, buffer, mimetype) {
    let uploadId;
    try {
        const multipartUpload = await s3.send(
            new CreateMultipartUploadCommand({
                Bucket: process.env.BACKBLAZE_BUCKET,
                Key: `${process.env.UPLOAD_FOLDER}/${originalname}`,
            })
        );
        uploadId = multipartUpload.UploadId;
        const uploadPromises = [];

        let numPartsLeft = 5;
        let partSize = Math.ceil(buffer.length / numPartsLeft);

        if (!(partSize > 1024 * 1024 * 5)) {
            numPartsLeft = 1;
            partSize = Math.ceil(buffer.length / numPartsLeft);
        }

        for (let i = 0; i < numPartsLeft; i++) {
            const star = partSize * i;
            const end = Math.min(star + partSize, buffer.length);
            uploadPromises.push(
                s3.send(
                    new UploadPartCommand({
                        Bucket: process.env.BACKBLAZE_BUCKET,
                        Key: `${process.env.UPLOAD_FOLDER}/${originalname}`,
                        PartNumber: i + 1,
                        UploadId: uploadId,
                        Body: buffer.subarray(star, end),
                    }),
                )
                    .then((data) => {
                        console.info("Part", i + 1, "uploaded");
                        return data;
                    })
            );
        }
        const results = await Promise.all(uploadPromises);

        const file = await s3.send(
            new CompleteMultipartUploadCommand({
                Bucket: process.env.BACKBLAZE_BUCKET,
                Key: `${process.env.UPLOAD_FOLDER}/${originalname}`,
                UploadId: uploadId,
                MultipartUpload: {
                    Parts: results.map((part, index) => ({
                        ETag: part.ETag,
                        PartNumber: index + 1,
                    })),
                },
            })
        );
        console.info("Upload completed successfully.");
        return {
            url: `https://${process.env.BACKBLAZE_BUCKET}.s3.${process.env.REGION}.backblazeb2.com/${process.env.UPLOAD_FOLDER}/${originalname}`,
            path: file.Key
        }
    }
    catch (error) {
        console.error(error)
        if (uploadId) {
            const abortCommand = new AbortMultipartUploadCommand({
                Bucket: process.env.BACKBLAZE_BUCKET,
                Key: `${process.env.UPLOAD_FOLDER}/${originalname}`,
                UploadId: uploadId,
            });
            await s3.send(abortCommand);
        }
        new Error(error)
    }
}

module.exports = {
    uploadFile
}