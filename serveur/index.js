const express = require('express');
const cors = require('cors');
const routesBillets = require('./routes/creerBillet');

const app = express();
const PORT = 3001;

// Permet à React (port 3000) d'appeler le serveur sans erreur de sécurité
app.use(cors());

// Permet de lire le corps des requêtes en JSON
app.use(express.json());

// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.json({ message: 'Serveur opérationnel' });
});

app.use('/billets', routesBillets);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
