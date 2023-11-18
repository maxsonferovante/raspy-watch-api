const { Router } = require('express');
const { upload } = require('./configMulter');

const { loadPage, uploadController, watchController } = require('./controllers');

const routes = Router();

routes.get('/', loadPage);
routes.post('/upload', upload.single('file'), uploadController);
routes.get('/watch', watchController);

module.exports = routes;