const express = require('express');
const router = express.Router();
const { creerBillet } = require('../services/billetService');

// Crée un nouveau billet
router.post('/', (req, res) => {
    try {
        const nouveauBillet = creerBillet(req.body);
        res.status(201).json(nouveauBillet);
    } catch (erreur) {
        res.status(400).json({ erreur: erreur.message });
    }
});

module.exports = router;
