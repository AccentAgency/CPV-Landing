const express = require('express');
const db = require('../config/config');



//Initializations
const router = express.Router();

router.post('/sendParticipacion', async (req, res) => {
    const {name,email,phone, cedula, ubicacion, codigo} = req.body;

    var f = new Date();
    var fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();

    const result = db.database().ref("Participantes"+codigo).push({
        Nombre:name,
        Cedula: cedula,
        Ubicacion:ubicacion,
        Email: email,
        Telefono: phone,
        Fecha: fecha
    })

    res.json(result);
});

router.get('/validationPerson/:cedula/:codigo', async(req,res) => {
    let {cedula,codigo} = req.params;
    const result = await db.database().ref("Participantes"+codigo).orderByChild("Cedula").equalTo(cedula).once('value', function(snapshoot){
        res.send(snapshoot.val());
    })
})

router.get('/getParticipantes/:codigo', async(req,res) => {
    let {codigo} = req.params;
    const result = await db.database().ref("Participantes"+codigo).once('value', function(snapshoot){
        res.send(snapshoot.val());
        console.log(snapshoot.val());
    })
})

router.get('/getGanadores/:codigo', async(req,res) => {
    let {codigo} = req.params;
    var value = [];
    const result = await db.database().ref("Participantes"+codigo).once('value', function(snapshoot){
        snapshoot.forEach(function(childNodes){
            value.push({Nombre:childNodes.val().Nombre});
        })
        res.send(value);
    })
})

module.exports = router;