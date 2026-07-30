const {
    creerBillet: insererBillet,
    listerBillets: obtenirBillets,
    modifierBillet: mettreAJourBillet,
    modifierStatut: mettreAJourStatut,
    supprimerBillet: supprimerBilletRepo,
} = require('../repos/billetRepo');

const STATUTS_VALIDES = ['Ouvert', 'En cours', 'Résolu', 'Fermé'];

// Valide les champs obligatoires communs à la création et à la modification
function validerBillet({ titre, description, categorie }) {
    if (!titre || titre.trim() === '') {
        throw new Error('Le titre est obligatoire.');
    }
    if (!description || description.trim() === '') {
        throw new Error('La description est obligatoire.');
    }
    if (!categorie || categorie.trim() === '') {
        throw new Error('La catégorie est obligatoire.');
    }
}

// Valide les données et crée un nouveau billet
function creerBillet(donnees) {
    validerBillet(donnees);
    return insererBillet(donnees);
}

// Retourne la liste des billets, filtrée par mot-clé, statut et/ou priorité si fournis
function listerBillets({ recherche, statut, priorite } = {}) {
    if (statut && !STATUTS_VALIDES.includes(statut)) {
        throw new Error('Statut invalide.');
    }
    return obtenirBillets({ recherche, statut, priorite });
}

// Valide les données et modifie un billet existant
function modifierBillet(id, donnees) {
    validerBillet(donnees);
    return mettreAJourBillet(id, donnees);
}

// Valide le statut et le change pour un billet existant
function modifierStatut(id, statut) {
    if (!STATUTS_VALIDES.includes(statut)) {
        throw new Error('Statut invalide.');
    }
    return mettreAJourStatut(id, statut);
}

// Supprime un billet existant
function supprimerBillet(id) {
    return supprimerBilletRepo(id);
}

module.exports = {
    creerBillet,
    listerBillets,
    modifierBillet,
    modifierStatut,
    supprimerBillet,
    STATUTS_VALIDES,
};
