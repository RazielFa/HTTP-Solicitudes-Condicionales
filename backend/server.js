const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders: ['Etag']
  };


app.use(cors(corsOptions));


app.get('/data', (req, res) => {
    const data = {
        message: "Hola, este es la información en tu Caché :("
    };

    const etag = `"${Buffer.from(JSON.stringify(data)).toString('base64')}"`;
    console.log(`etag ${etag}`);
    
    if (req.headers['if-none-match'] === etag) {
        res.status(304).end();
    } else {
        
        res.setHeader('ETag', etag);
        res.json(data);
    }
});

    app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
