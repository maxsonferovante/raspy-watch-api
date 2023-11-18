const { default: axios } = require('axios');
const { uploadFile } = require('./blackblazer');

const pathIndexHTML = __dirname + '/templates/index.html';

let fileObject = {
    url: '',
    path: ''
};

const loadPage = (req, res) => {
    try {
        return res.sendFile(pathIndexHTML);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
}

const uploadController = async (req, res) => {
    const { file } = req;
    if (!file) {
        return res.status(400).send('Nenhum vídeo enviado.');
    }
    // Salva o vídeo recebido no servidor
    try {
        const result = await uploadFile(file.originalname, file.buffer, file.mimetype);
        fileObject = {
            url: result.url,
            path: result.path
        };
        console.info('Vídeo recebido:', result.path);

        res.status(200).send({
            message: 'Vídeo recebido com sucesso.',
            data: result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
}
const watchController = async (req, res) => {
    const range = req.headers.range;
    if (!range) {
        return res.status(400).send('Requisição inválida.');
    }
    if (fileObject.url === '') {
        console.info("Arquivo não encontrado");
        return res.writeHead(200, {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*'
        });
    }
    const videoPath = fileObject.url;
    console.info("Video path: ", videoPath);
    axios.get(videoPath,
        {
            responseType: 'stream'
        }).then(response => {
            const videoSize = response.headers['content-length'];
            const start = Number(range.replace(/\D/g, ''));
            const end = videoSize - 1;
            const contentLength = end - start + 1;

            const headers = {
                'Content-Range': `bytes ${start}-${end}/${videoSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': contentLength,
                'Content-Type': 'video/mp4',
                'Content-Disposition': `attachment; filename="${fileObject.path}"`,
                'X-Video-Nome': fileObject.path
            };
            const videoStream = response.data;
            res.writeHead(206, headers);
            videoStream.pipe(res);
        }).catch(err => {
            console.error(err.message);
            res.status(500).send(err.message);
        });
};
module.exports = {
    loadPage,
    uploadController,
    watchController
}