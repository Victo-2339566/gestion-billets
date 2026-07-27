const db = require('../bd');

// Insère un billet en base et retourne la ligne créée
function creerBillet({ titre, description, categorie, priorite }) {
    const insertion = db.prepare(`
        INSERT INTO billets (titre, description, categorie, priorite, statut, dateCreation)
        VALUES (?, ?, ?, ?, 'Ouvert', ?)
    `);

    const resultat = insertion.run(
        titre.trim(),
        description.trim(),
        categorie.trim(),
        priorite || '',
        new Date().toISOString()
    );

    return db.prepare('SELECT * FROM billets WHERE id = ?').get(resultat.lastInsertRowid);
}

module.exports = { creerBillet };
