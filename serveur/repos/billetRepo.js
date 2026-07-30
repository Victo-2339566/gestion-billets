const db = require('../bd');

// Insère un billet  et retourne la ligne créée
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

// Retourne les billets correspondant au mot-clé, au statut et/ou à la priorité fournis
// (tous les filtres sont optionnels et combinables)
function listerBillets({ recherche, statut, priorite } = {}) {
    let sql = 'SELECT * FROM billets WHERE 1=1';
    const params = [];

    if (recherche) {
        sql += ' AND (titre LIKE ? OR description LIKE ?)';
        const motif = `%${recherche}%`;
        params.push(motif, motif);
    }
    if (statut) {
        sql += ' AND statut = ?';
        params.push(statut);
    }
    if (priorite) {
        sql += ' AND priorite = ?';
        params.push(priorite);
    }

    sql += ' ORDER BY id DESC';
    return db.prepare(sql).all(...params);
}

// Met à jour un billet existant et retourne la ligne modifiée, ou null si l'id n'existe pas
function modifierBillet(id, { titre, description, categorie, priorite }) {
    const resultat = db.prepare(`
        UPDATE billets
        SET titre = ?, description = ?, categorie = ?, priorite = ?
        WHERE id = ?
    `).run(titre.trim(), description.trim(), categorie.trim(), priorite || '', id);

    if (resultat.changes === 0) {
        return null;
    }

    return db.prepare('SELECT * FROM billets WHERE id = ?').get(id);
}

// Change uniquement le statut d'un billet et retourne la ligne modifiée, ou null si l'id n'existe pas
function modifierStatut(id, statut) {
    const resultat = db.prepare('UPDATE billets SET statut = ? WHERE id = ?').run(statut, id);

    if (resultat.changes === 0) {
        return null;
    }

    return db.prepare('SELECT * FROM billets WHERE id = ?').get(id);
}

// Supprime un billet et indique si une ligne a bien été supprimée
function supprimerBillet(id) {
    const resultat = db.prepare('DELETE FROM billets WHERE id = ?').run(id);
    return resultat.changes > 0;
}

module.exports = {
    creerBillet,
    listerBillets,
    modifierBillet,
    modifierStatut,
    supprimerBillet,
};
