import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function FormulaireBillet({ billetAModifier, onSucces, onErreur, onAnnuler }) {
    // Initialisé directement depuis le billet à modifier (le composant est
    // remonté via sa prop "key" dans App.jsx à chaque changement de cible)
    const [titre, setTitre] = useState(billetAModifier?.titre ?? '');
    const [description, setDescription] = useState(billetAModifier?.description ?? '');
    const [categorie, setCategorie] = useState(billetAModifier?.categorie ?? '');
    const [priorite, setPriorite] = useState(billetAModifier?.priorite ?? '');

    const enModification = Boolean(billetAModifier);

    const soumettre = async (e) => {
        e.preventDefault();

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
                Titre
                <input
                    type="text"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                />
            </label>

            <label className="champ">
                Description
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>

            <label className="champ">
                Catégorie
                <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
                    <option value="">-- Choisir --</option>
                    <option value="Bug">Bug</option>
                    <option value="Amélioration">Amélioration</option>
                    <option value="Question">Question</option>
                    <option value="Autre">Autre</option>
                </select>
            </label>

            <label className="champ">
                Priorité
                <select value={priorite} onChange={(e) => setPriorite(e.target.value)}>
                    <option value="">-- Choisir --</option>
                    <option value="Basse">Basse</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Haute">Haute</option>
                </select>
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
            </div>
        </form>
    );
}

export default FormulaireBillet;
