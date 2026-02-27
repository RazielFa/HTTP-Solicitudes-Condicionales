const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json()); 

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders: ['Etag', 'Last-Modified']
};

app.use(cors(corsOptions));

app.get('/data', (req, res) => {
    const data = { message: "Hola, este es la información en tu Caché :(" };
    const etag = `"${Buffer.from(JSON.stringify(data)).toString('base64')}"`;
    
    if (req.headers['if-none-match'] === etag) {
        res.status(304).end();
    } else {
        res.setHeader('ETag', etag);
        res.json(data);
    }
});

let productLastModified = new Date('2024-01-01T10:00:00Z').toUTCString();
let productData = {
    name: "Teclado Mecánico",
    price: 120.00,
    message: "Datos de producto"
};

app.get('/product', (req, res) => {
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

app.put('/product', (req, res) => {
    const { name, price, message } = req.body;

    if (name) productData.name = name;
    if (price) productData.price = price;
    if (message) productData.message = message;

    productLastModified = new Date().toUTCString();
    
    console.log(`Producto modificado vía PUT. Nuevo Last-Modified: ${productLastModified}`);

    res.json({
        success: true,
        message: "Producto actualizado correctamente en el servidor",
        updatedData: productData
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});