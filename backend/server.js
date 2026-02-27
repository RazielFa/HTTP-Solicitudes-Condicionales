const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders: ['Etag', 'Last-Modified']
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

const productLastModified = new Date('2024-01-01T10:00:00Z').toUTCString();

app.get('/product', (req, res) => {
    const productData = {
        name: "Teclado Mecánico",
        price: 120.00,
        message: "Datos de producto"
    };

    const ifModifiedSince = req.headers['if-modified-since'];
    console.log(`If-Modified-Since recibido: ${ifModifiedSince}`);

    if (ifModifiedSince === productLastModified) {
        console.log("El producto no ha cambiado. Enviando 304.");
        return res.status(304).end();
    }

    console.log("Datos no cacheados o modificados. Enviando 200 OK.");
    res.setHeader('Last-Modified', productLastModified);
    res.json(productData);
});

    app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
