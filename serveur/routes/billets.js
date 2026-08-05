const express = require('express');
const router = express.Router();
const {
    creerBillet,
    listerBillets,
    modifierBillet,
    modifierStatut,
    supprimerBillet,
} = require('../services/billetService');
const {
    suggererCategorieEtPriorite,
    proposerDepannage,
} = require('../services/suggestionService');

// Crée un nouveau billet
router.post('/', (req, res) => {
    try {
        const nouveauBillet = creerBillet(req.body);
        res.status(201).json(nouveauBillet);
    } catch (erreur) {
        res.status(400).json({ erreur: erreur.message });
    }
});

// Suggère une catégorie et une priorité via l'IA locale (Ollama), à partir du titre et de la description
router.post('/suggestion', async (req, res) => {
    const { titre, description } = req.body;

    if (!titre || !description) {
        return res.status(400).json({ erreur: 'Le titre et la description sont requis pour la suggestion.' });
    }

    try {
        const suggestion = await suggererCategorieEtPriorite(titre, description);
        res.json(suggestion);
    } catch (erreur) {
        res.status(502).json({ erreur: erreur.message });
    }
});

// Propose des étapes de dépannage de base via l'IA locale (Ollama), avant de créer un billet
router.post('/depannage', async (req, res) => {
    const { titre, description } = req.body;

    if (!titre || !description) {
        return res.status(400).json({ erreur: 'Le titre et la description sont requis pour le dépannage.' });
    }

    try {
        const resultat = await proposerDepannage(titre, description);
        res.json(resultat);
    } catch (erreur) {
        res.status(502).json({ erreur: erreur.message });
    }
});

// Retourne la liste des billets, filtrée par mot-clé, statut et/ou priorité (?recherche=...&statut=...&priorite=...)
router.get('/', (req, res) => {
    try {
        const { recherche, statut, priorite } = req.query;
        res.json(listerBillets({ recherche, statut, priorite }));
    } catch (erreur) {
        res.status(400).json({ erreur: erreur.message });
    }
});

// Modifie un billet existant
router.put('/:id', (req, res) => {
    try {
        const billetModifie = modifierBillet(Number(req.params.id), req.body);
        if (!billetModifie) {
            return res.status(404).json({ erreur: 'Billet introuvable.' });
        }
        res.json(billetModifie);
    } catch (erreur) {
        res.status(400).json({ erreur: erreur.message });
    }
});

// Change uniquement le statut d'un billet
router.patch('/:id/statut', (req, res) => {
    try {
        const billetModifie = modifierStatut(Number(req.params.id), req.body.statut);
        if (!billetModifie) {
            return res.status(404).json({ erreur: 'Billet introuvable.' });
        }
        res.json(billetModifie);
    } catch (erreur) {
        res.status(400).json({ erreur: erreur.message });
    }
});

// Supprime un billet existant
router.delete('/:id', (req, res) => {
    const supprime = supprimerBillet(Number(req.params.id));
    if (!supprime) {
        return res.status(404).json({ erreur: 'Billet introuvable.' });
    }
    res.json({ message: 'Billet supprimé avec succès.' });
});

module.exports = router;
