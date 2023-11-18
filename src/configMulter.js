const multer = require('multer');

// Configuração do Multer para o upload de vídeos
const upload = multer({
    limits: {
        fileSize: 1024 * 1024 * Number(process.env.LIMIT_SIZE) // 200mb
    }
});


module.exports = {
    upload
}