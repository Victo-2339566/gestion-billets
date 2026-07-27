const Database = require('better-sqlite3');

// Le fichier billets.db est créé automatiquement s'il n'existe pas encore
const db = new Database('billets.db');

// Création de la table billets si elle n'existe pas déjà
db.exec(`
    CREATE TABLE IF NOT EXISTS billets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titre TEXT NOT NULL,
        description TEXT,
        categorie TEXT,
        priorite TEXT,
        statut TEXT NOT NULL DEFAULT 'Ouvert',
        dateCreation TEXT NOT NULL
    )
`);

module.exports = db;
