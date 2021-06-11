const express = require('express');
const db = require('../config/config');



//Initializations
const router = express.Router();

router.post('/sendParticipacion', async (req, res) => {
    const {name,email,phone, cedula, ubicacion} = req.body;

    var f = new Date();
    var fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();

    const result = db.database().ref("Participantes").push({
        Nombre:name,
        Cedula: cedula,
        Ubicacion:ubicacion,
        Email: email,
        Telefono: phone,
        Fecha: fecha
    })

    res.json(result);
});

module.exports = router;