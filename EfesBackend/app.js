'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var path = require('path');

// Initializations
const app = express();
const test = require('./src/routes/firebase');


// Express middlewares
app.use(cors());

//Set up body-parser with JSON
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express Routes
// Vista por defecto para la ruta raiz

app.use('/test', test);


// Start server
// Catch 404 errors and forward to error handler. This is called if no match is found in the preceding route functions.


const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
    console.log(`Server running on server on port: ${PORT}`);
});

app.get('/test', function(req, res){
	res.send('HELLOOOOOOO');
	console.log('Se recibio una petición get');
});

app.get('*', (req, res)=>{
	res.sendFile(path.resolve(where, the, index.html, is))
})