import { useState } from 'react';
import Modale from './Modale';

const API_URL = import.meta.env.VITE_API_URL;

function FormulaireBillet({ billetAModifier, onSucces, onErreur, onAnnuler }) {
    // Initialisé directement depuis le billet à modifier (le composant est
    // remonté via sa prop "key" dans App.jsx à chaque changement de cible)
    const [titre, setTitre] = useState(billetAModifier?.titre ?? '');
    const [description, setDescription] = useState(billetAModifier?.description ?? '');
    const [categorie, setCategorie] = useState(billetAModifier?.categorie ?? '');
    const [priorite, setPriorite] = useState(billetAModifier?.priorite ?? '');
    const [suggestionEnCours, setSuggestionEnCours] = useState(false);
    const [depannageEnCours, setDepannageEnCours] = useState(false);
    const [etapesDepannage, setEtapesDepannage] = useState(null);
    const [erreurs, setErreurs] = useState({});

    const enModification = Boolean(billetAModifier);

    // Retire le message d'erreur d'un champ dès que l'utilisateur le corrige
    const viderErreur = (champ) => {
        setErreurs((precedent) => ({ ...precedent, [champ]: undefined }));
    };

    // Vérifie les champs obligatoires avant l'envoi au serveur, pour un
    // retour immédiat sans attendre l'aller-retour réseau
    const validerChamps = () => {
        const nouvellesErreurs = {};
        if (!titre.trim()) nouvellesErreurs.titre = 'Le titre est obligatoire.';
        if (!description.trim()) nouvellesErreurs.description = 'La description est obligatoire.';
        if (!categorie) nouvellesErreurs.categorie = 'La catégorie est obligatoire.';
        if (!priorite) nouvellesErreurs.priorite = 'La priorité est obligatoire.';
        return nouvellesErreurs;
    };

    // Demande à l'IA locale des pistes de dépannage de base, avant de créer le billet
    const voirDepannage = async () => {
        if (!titre || !description) {
            onErreur('Remplis le titre et la description avant de voir des solutions de dépannage.');
            return;
        }

        setDepannageEnCours(true);
        try {
            const reponse = await fetch(`${API_URL}/billets/depannage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titre, description }),
            });

            const donnees = await reponse.json();

            if (!reponse.ok) {
                onErreur(donnees.erreur);
                return;
            }

            setEtapesDepannage(donnees.etapes);
        } finally {
            setDepannageEnCours(false);
        }
    };

    // Demande à l'IA locale (Ollama) de suggérer la catégorie et la priorité
    const suggererCategorieEtPriorite = async () => {
        if (!titre || !description) {
            onErreur('Remplis le titre et la description avant de demander une suggestion.');
            return;
        }

        setSuggestionEnCours(true);
        try {
            const reponse = await fetch(`${API_URL}/billets/suggestion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titre, description }),
            });

            const donnees = await reponse.json();

            if (!reponse.ok) {
                onErreur(donnees.erreur);
                return;
            }

            setCategorie(donnees.categorie);
            setPriorite(donnees.priorite);
        } finally {
            setSuggestionEnCours(false);
        }
    };

    const soumettre = async (e) => {
        e.preventDefault();

        const nouvellesErreurs = validerChamps();
        if (Object.keys(nouvellesErreurs).length > 0) {
            setErreurs(nouvellesErreurs);
            return;
        }

        const url = enModification
            ? `${API_URL}/billets/${billetAModifier.id}`
            : `${API_URL}/billets`;

        const reponse = await fetch(url, {
            method: enModification ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titre, description, categorie, priorite }),
        });

        const donnees = await reponse.json();

        if (!reponse.ok) {
            onErreur(donnees.erreur);
            return;
        }

        // Réinitialise les champs (utile surtout en création, car la
        // modification remonte de toute façon le composant après succès)
        setTitre('');
        setDescription('');
        setCategorie('');
        setPriorite('');
        setErreurs({});

        onSucces(
            enModification
                ? `Billet #${donnees.id} modifié avec succès.`
                : `Billet #${donnees.id} créé avec succès.`
        );
    };

    return (
        <form className="formulaire-billet" onSubmit={soumettre}>
            <h2>{enModification ? `Modifier le billet #${billetAModifier.id}` : 'Créer un billet'}</h2>

            <label className="champ">
                <span>Titre <span className="obligatoire">*</span></span>
                <input
                    type="text"
                    className={erreurs.titre ? 'champ-invalide' : ''}
                    value={titre}
                    onChange={(e) => { setTitre(e.target.value); viderErreur('titre'); }}
                />
                {erreurs.titre && <span className="texte-erreur">{erreurs.titre}</span>}
            </label>

            <label className="champ">
                <span>Description <span className="obligatoire">*</span></span>
                <textarea
                    className={erreurs.description ? 'champ-invalide' : ''}
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); viderErreur('description'); }}
                />
                {erreurs.description && <span className="texte-erreur">{erreurs.description}</span>}
            </label>

            <div className="actions">
                <button
                    type="button"
                    className="bouton bouton-ia"
                    onClick={suggererCategorieEtPriorite}
                    disabled={suggestionEnCours}
                >
                    {suggestionEnCours ? 'Suggestion en cours...' : 'Suggérer catégorie/priorité (IA)'}
                </button>
            </div>

            {etapesDepannage && (
                <Modale titre="Solutions de dépannage suggérées" onFermer={() => setEtapesDepannage(null)}>
                    <ol>
                        {etapesDepannage.map((etape, index) => (
                            <li key={index}>{etape}</li>
                        ))}
                    </ol>
                </Modale>
            )}

            <label className="champ">
                <span>Catégorie <span className="obligatoire">*</span></span>
                <select
                    className={erreurs.categorie ? 'champ-invalide' : ''}
                    value={categorie}
                    onChange={(e) => { setCategorie(e.target.value); viderErreur('categorie'); }}
                >
                    <option value="">-- Choisir --</option>
                    <option value="Bug">Bug</option>
                    <option value="Amélioration">Amélioration</option>
                    <option value="Question">Question</option>
                    <option value="Autre">Autre</option>
                </select>
                {erreurs.categorie && <span className="texte-erreur">{erreurs.categorie}</span>}
            </label>

            <label className="champ">
                <span>Priorité <span className="obligatoire">*</span></span>
                <select
                    className={erreurs.priorite ? 'champ-invalide' : ''}
                    value={priorite}
                    onChange={(e) => { setPriorite(e.target.value); viderErreur('priorite'); }}
                >
                    <option value="">-- Choisir --</option>
                    <option value="Basse">Basse</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Haute">Haute</option>
                </select>
                {erreurs.priorite && <span className="texte-erreur">{erreurs.priorite}</span>}
            </label>

            <div className="actions">
                <button type="submit" className="bouton bouton-principal">
                    {enModification ? 'Enregistrer les modifications' : 'Créer le billet'}
                </button>
                {enModification && (
                    <button type="button" className="bouton bouton-secondaire" onClick={onAnnuler}>
                        Annuler
                    </button>
                )}
                {!enModification && (
                    <button
                        type="button"
                        className="bouton bouton-ia"
                        onClick={voirDepannage}
                        disabled={depannageEnCours}
                    >
                        {depannageEnCours ? 'Recherche de solutions...' : 'Voir des solutions de dépannage (IA)'}
                    </button>
                )}
            </div>
        </form>
    );
}

export default FormulaireBillet;
