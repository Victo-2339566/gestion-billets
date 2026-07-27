const { creerBillet: insererBillet } = require('../repos/billetRepo');

// Valide les données et crée un nouveau billet
function creerBillet(donnees) {
    const { titre, description, categorie } = donnees;

    if (!titre || titre.trim() === '') {
        throw new Error('Le titre est obligatoire.');
    }
    if (!description || description.trim() === '') {
        throw new Error('La description est obligatoire.');
    }
    if (!categorie || categorie.trim() === '') {
        throw new Error('La catégorie est obligatoire.');
    }

    return insererBillet(donnees);
}

module.exports = { creerBillet };
