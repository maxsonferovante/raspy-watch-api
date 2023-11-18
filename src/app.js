require('dotenv').config();
const server = require('./server');

// Inicia o servidor
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
